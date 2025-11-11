import Dexie, { type Table } from 'dexie'

export interface Product {
  id?: number
  name: string
  price: number
  stock: number
}

export class AppDB extends Dexie {
  products!: Table<Product, number>

  constructor() {
    super('AppDB')

    this.version(1).stores({
      products: '++id,name,price,stock',
    })

    this.products = this.table<Product, number>('products')

    // ✅ Use Dexie’s event API in a way that bypasses overload conflicts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.products.hook as any)('creating', async () => {
      await this.backup()
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.products.hook as any)('updating', async () => {
      await this.backup()
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.products.hook as any)('deleting', async () => {
      await this.backup()
    })
  }

  async backup() {
    const allData = await this.products.toArray()
    localStorage.setItem('product_backup', JSON.stringify(allData))
    console.log('✅ Backup complete')
  }

  async restore() {
    const data = localStorage.getItem('product_backup')
    if (data) {
      const products: Product[] = JSON.parse(data)
      await this.products.clear()
      await this.products.bulkAdd(products)
      console.log('🔄 Restore complete')
    }
  }
}

export const db = new AppDB()
