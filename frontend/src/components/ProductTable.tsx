import { useEffect, useState } from "react"

type Product = {
  id: number
  name: string
  quantity: number
}

function ProductTable() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("https://localhost:5001/api/items")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div>
      <h2>Products</h2>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable