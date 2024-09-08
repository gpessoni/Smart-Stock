"use client"

import { useState, useEffect } from "react"
import { Chart } from "primereact/chart"
import { Card } from "primereact/card"
import Navbar from "@/components/Navbar"
import styles from "./page.module.css"

interface ProductStorageBalance {
    balance: number
    storageId: number
    productId: number
}

interface Product {
    id: number
    description: string
    ProductStorageBalances: ProductStorageBalance[]
}

interface InventoryItem {
    id: number
    productId: number
    quantity: number
    status: "PROCESSED" | "NOT_PROCESSED"
    createdAt: string
    updatedAt: string
}

interface AddressTransfer {
    id: string
    productId: string
    fromAddressId: string
    toAddressId: string
    return: boolean | null
    quantity: number
    createdAt: string
    product: {
        id: string
        code: string
        description: string
    }
    fromAddress: {
        id: string
        address: string
        description: string
    }
    toAddress: {
        id: string
        address: string
        description: string
    }
}

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<Product[]>([])
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [transfers, setTransfers] = useState<AddressTransfer[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    const fetchData = async () => {
        try {
            const [productsRes, transferRes, inventoryRes] = await Promise.all([
                fetch("/api/products", {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }),
                fetch("/api/address-transfer", {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }),
                fetch("/api/product-inventory", {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }),
            ])

            const productsData: Product[] = await productsRes.json()
            const inventoryData: InventoryItem[] = await inventoryRes.json()
            const transferData: AddressTransfer[] = await transferRes.json()

            setProducts(productsData)
            setInventory(inventoryData)
            setTransfers(transferData)
        } catch (error) {
            console.error("Erro ao buscar dados:", error)
        } finally {
            setLoading(false)
        }
    }

    const totalBalance = products.reduce((total, product) => total + product.ProductStorageBalances.reduce((sum, balance) => sum + balance.balance, 0), 0)
    const processedItems = inventory.filter((item) => item.status === "PROCESSED").length
    const totalInventoryCount = inventory.length
    const uniqueProductsCount = products.length
    const uniqueProcessedProductsCount = new Set(inventory.filter((item) => item.status === "PROCESSED").map((item) => item.productId)).size

    // Dados para gráficos
    const productLabels = products.map((product) => product.description)
    const productBalances = products.map((product) => product.ProductStorageBalances.reduce((sum, balance) => sum + balance.balance, 0))

    const inventoryStatuses = ["PROCESSED", "NOT_PROCESSED"]
    const inventoryCounts = inventoryStatuses.map((status) => inventory.filter((item) => item.status === status).length)

    const inventoryData = {
        labels: productLabels,
        datasets: [
            {
                label: "Saldo por Produto",
                data: productBalances,
                backgroundColor: "#42A5F5",
            },
        ],
    }

    const inventoryStatusData = {
        labels: inventoryStatuses,
        datasets: [
            {
                label: "Status dos Inventários",
                data: inventoryCounts,
                backgroundColor: ["#66BB6A", "#FFCA28"],
            },
        ],
    }

    const totalTransfers = transfers.length
    const totalQuantities = transfers.reduce((sum, transfer) => sum + transfer.quantity, 0)
    const uniqueAddresses = new Set([...transfers.map((t) => t.fromAddress.description), ...transfers.map((t) => t.toAddress.description)])

    const addressLabels = Array.from(uniqueAddresses)
    const addressTransferCounts = addressLabels.map(
        (addressId) => transfers.filter((transfer) => transfer.fromAddress.description === addressId || transfer.toAddress.description === addressId).length
    )

    const transferData = {
        labels: addressLabels,
        datasets: [
            {
                label: "Transferências por Endereço",
                data: addressTransferCounts,
                backgroundColor: "#42A5F5",
            },
        ],
    }

    const productBalancePieData = {
        labels: productLabels,
        datasets: [
            {
                label: "Distribuição de Saldo por Produto",
                data: productBalances,
                backgroundColor: productLabels.map(() => "#" + Math.floor(Math.random() * 16777215).toString(16)),
            },
        ],
    }

    if (loading) {
        return <div>Carregando...</div>
    }

    return (
        <>
            <div className={styles.container}>
                <Navbar />
                <h1>Dashboard de Estoque</h1>

                <div className={styles.cardContainer}>
                    <Card title="Itens Inventáriados" className={styles.card}>
                        <p className={styles.cardValue}>{processedItems}</p>
                    </Card>
                    <Card title="Total de Inventários" className={styles.card}>
                        <p className={styles.cardValue}>{totalInventoryCount}</p>
                    </Card>
                    <Card title="Produtos Diferentes" className={styles.card}>
                        <p className={styles.cardValue}>{uniqueProductsCount}</p>
                    </Card>
                    <Card title="Produtos Inventáriados" className={styles.card}>
                        <p className={styles.cardValue}>{uniqueProcessedProductsCount}</p>
                    </Card>

                    <Card title="Total de Transferências" className={styles.card}>
                        <p className={styles.cardValue}>{totalTransfers}</p>
                    </Card>
                    <Card title="Quantidade Total Transferida" className={styles.card}>
                        <p className={styles.cardValue}>{totalQuantities}</p>
                    </Card>
                </div>

                <div className={styles.chartGrid}>
                    <div className={styles.chartItem}>
                        <h3>Saldo por Produto</h3>
                        <Chart
                            style={{
                                height: "300px",
                            }}
                            type="bar"
                            data={inventoryData}
                            options={{ maintainAspectRatio: false }}
                        />{" "}
                    </div>
                    <div className={styles.chartItem}>
                        <h3>Status dos Inventários</h3>
                        <Chart type="doughnut" data={inventoryStatusData} options={{ maintainAspectRatio: false }} />
                    </div>
                    <div className={styles.chartItem}>
                        <h3>Distribuição de Saldo por Produto</h3>
                        <Chart type="pie" data={productBalancePieData} options={{ maintainAspectRatio: false }} />
                    </div>
                    <div className={styles.chartItem}>
                        <h3>Transferências por Endereço</h3>
                        <Chart style={{ height: "300px" }} type="bar" data={transferData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </>
    )
}
