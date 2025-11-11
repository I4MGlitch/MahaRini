import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore"

interface Product {
  id?: string
  name: string
  price: number
  stock: number
}

const products = ref<Product[]>([])
const newProduct = ref<Product>({ name: '', price: 0, stock: 0 })

const productsCollection = collection(db, "products")

async function loadProducts() {
  const snapshot = await getDocs(productsCollection)
  products.value = snapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  })) as Product[]
}

async function addProduct() {
  await addDoc(productsCollection, { ...newProduct.value })
  newProduct.value = { name: '', price: 0, stock: 0 }
  loadProducts()
}

async function updateProduct(updated: Product) {
  if (!updated.id) return
  const ref = doc(db, "products", updated.id)
  await updateDoc(ref, {
    name: updated.name,
    price: updated.price,
    stock: updated.stock
  })
  loadProducts()
}

async function remove(id: string) {
  await deleteDoc(doc(db, "products", id))
  loadProducts()
}

onMounted(loadProducts)
