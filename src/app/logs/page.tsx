"use client"

import Navbar from "@/components/Navbar"
import "primeicons/primeicons.css"
import { Column } from "primereact/column"
import { DataTable, DataTableFilterMeta } from "primereact/datatable"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Skeleton } from "primereact/skeleton"
import { Toast } from "primereact/toast"
import { useEffect, useRef, useState } from "react"
import styles from "./../page.module.css"
import { Toolbar } from "primereact/toolbar"
import { InputText } from "primereact/inputtext"

type Log = {
    id: string
    action: string
    type: string
    userId: string
    createdAt: Date
    updatedAt: Date
    user: {
        id: string
        username: string
    }
}

export default function Logs() {
    const [loading, setLoading] = useState<boolean>(true)
    const [logs, setLogs] = useState<Log[]>([])
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        action: { value: null, matchMode: "contains" },
        type: { value: null, matchMode: "contains" },
        createdAt: { value: null, matchMode: "contains" },
    })
    const toast = useRef<Toast>(null)

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            const response = await fetch("/api/logs", {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const data = await response.json()
            setLogs(data)
        } catch (error) {
            console.error("Erro ao buscar logs:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar logs",
                life: 3000,
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className={styles.skeletonContainer}>
                <Skeleton shape="rectangle" width="100%" height="100vh" />
            </div>
        )
    }

    const LogBadge: React.FC<any> = ({ type }) => {
        const getBadgeStyle = (type: string) => {
            switch (type) {
                case "CREATE":
                    return { backgroundColor: "#4caf50", color: "#fff" } // verde
                case "UPDATE":
                    return { backgroundColor: "#ff9800", color: "#fff" } // laranja
                case "DELETE":
                    return { backgroundColor: "#f44336", color: "#fff" } // vermelho
                case "LIST":
                    return { backgroundColor: "#2196f3", color: "#fff" } // azul
                default:
                    return { backgroundColor: "#9e9e9e", color: "#fff" } // cinza
            }
        }

        return (
            <span
                style={{
                    padding: "0.5em 1em",
                    borderRadius: "1em",
                    display: "inline-block",
                    ...getBadgeStyle(type),
                }}
            >
                {type}
            </span>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <div className="flex justify-between w-full">
                <InputText
                    id="globalFilter"
                    placeholder="Pesquisar"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, global: { value: e.target.value, matchMode: "contains" } })}
                    className="ml-2"
                />
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="p-mb-4 p-toolbar" right={rightToolbarTemplate}></Toolbar>
                <DataTable
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters as DataTableFilterMeta)}
                    header="Logs"
                    style={{
                        width: "100%",
                        overflow: "auto",
                        border: "1px solid #ccc",
                    }}
                    value={logs}
                    paginator
                    rows={7}
                    rowsPerPageOptions={[7, 10, 25, 50]}
                >
                    <Column align="center" field="action" header="Ação" sortable></Column>
                    <Column align="center" field="type" body={(rowData) => <LogBadge type={rowData.type} />} header="Tipo" sortable></Column>
                    <Column align="center" field="user.username" header="Usuário" sortable></Column>
                    <Column
                        align="center"
                        field="createdAt"
                        header="Data de Criação"
                        body={(rowData) => {
                            const date = new Date(rowData.createdAt)
                            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
                        }}
                        sortable
                    ></Column>
                    <Column
                        align="center"
                        field="updatedAt"
                        header="Data de Atualização"
                        body={(rowData) => {
                            const date = new Date(rowData.updatedAt)
                            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
                        }}
                        sortable
                    ></Column>
                </DataTable>
            </div>
        </>
    )
}
