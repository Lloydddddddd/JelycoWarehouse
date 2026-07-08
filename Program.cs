using JelycoWarehouse.Data;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using JelycoWarehouse.Repositories;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


// Controllers
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling =
            Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });


// Connection String
var connectionString = builder.Environment.IsDevelopment()
    ? builder.Configuration.GetConnectionString("DevConnection")
    : builder.Configuration.GetConnectionString("ProdConnection");

builder.Services.AddDbContext<WarehouseContext>(options =>
    options.UseSqlServer(connectionString));


// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.ClaimsIdentity.RoleClaimType = ClaimTypes.Role;
})
.AddEntityFrameworkStores<WarehouseContext>()
.AddDefaultTokenProviders();


// Prevent redirects
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


// JWT
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key missing.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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

        IssuerSigningKey =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

        RoleClaimType = ClaimTypes.Role,

        ClockSkew = TimeSpan.Zero
    };

    // ===== JWT DEBUG =====
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            Console.WriteLine("========== JWT RECEIVED ==========");
            Console.WriteLine(context.Request.Headers.Authorization.ToString());
            return Task.CompletedTask;
        },

        OnTokenValidated = context =>
        {
            Console.WriteLine("========== JWT VALID ==========");
            Console.WriteLine(context.Principal?.Identity?.Name);
            return Task.CompletedTask;
        },

        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("========== JWT FAILED ==========");
            Console.WriteLine(context.Exception.ToString());
            return Task.CompletedTask;
        },

        OnChallenge = context =>
        {
            Console.WriteLine("========== JWT CHALLENGE ==========");
            Console.WriteLine(context.Error);
            Console.WriteLine(context.ErrorDescription);
            return Task.CompletedTask;
        }
    };
});


// Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1",
        new OpenApiInfo
        {
            Title = "Jelyco Warehouse API",
            Version = "v1"
        });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter ONLY the JWT token."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference =
                    new OpenApiReference
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
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});


var app = builder.Build();


// Seeder
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<WarehouseContext>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    await DataSeeder.Seed(context, roleManager, userManager);
}


// Pipeline
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "JelycoWarehouse API running.")
    .AllowAnonymous();

app.Run();