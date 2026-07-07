using JelycoWarehouse.Data;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using JelycoWarehouse.Repositories;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

// Decide which connection string to use (Dev vs Prod)
var connectionString = builder.Environment.IsDevelopment()
    ? builder.Configuration.GetConnectionString("DevConnection")
    : builder.Configuration.GetConnectionString("ProdConnection");

// EF Core with SQL Server
builder.Services.AddDbContext<WarehouseContext>(options =>
    options.UseSqlServer(connectionString));

// Identity with explicit RoleClaimType (match token exactly)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.ClaimsIdentity.RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
})
    .AddEntityFrameworkStores<WarehouseContext>()
    .AddDefaultTokenProviders();

// Ensure unauthorized requests return 401/403 instead of redirecting
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"]
             ?? throw new InvalidOperationException("JWT Key is missing in configuration.");

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        };
    });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "JelycoWarehouse API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Repositories
builder.Services.AddScoped<IItemRepository, ItemRepository>();
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IStockLevelRepository, StockLevelRepository>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();

// Services
builder.Services.AddScoped<ItemService>();
builder.Services.AddScoped<SupplierService>();
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<AuthService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:5173") // React dev server
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials());
});

builder.Services.AddAuthorization(options =>
{
    // Require authentication by default for all endpoints
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

var app = builder.Build();

// Seeder
//using (var scope = app.Services.CreateScope())
//{
//    var context = scope.ServiceProvider.GetRequiredService<WarehouseContext>();
//    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
//    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
//    await DataSeeder.Seed(context, roleManager, userManager);
//}

// Pipeline
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Allow anonymous access to Swagger endpoints
app.MapSwagger().AllowAnonymous();

// Friendly root endpoint
app.MapGet("/", () => "JelycoWarehouse API is running...").AllowAnonymous();

// Diagnostic: list all registered endpoints at startup
var endpoints = app.Services.GetRequiredService<Microsoft.AspNetCore.Routing.EndpointDataSource>().Endpoints;
foreach (var e in endpoints)
{
    Console.WriteLine(e);
}

app.Run();