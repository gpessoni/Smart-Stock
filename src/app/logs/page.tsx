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
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

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

type UserOption = {
    label: string
    value: string
}

const logTypes = [
    { label: "Listar", value: "LIST" },
    { label: "Criar", value: "CREATE" },
    { label: "Deletar", value: "DELETE" },
    { label: "Atualizar", value: "UPDATE" },
]

export default function Logs() {
    const [loading, setLoading] = useState<boolean>(true)
    const [logs, setLogs] = useState<Log[]>([])
    const [filteredLogs, setFilteredLogs] = useState<Log[]>([])
    const [filters, setFilters] = useState({
        text: "",
        user: null as string | null,
        startDate: null as Date | null,
        endDate: null as Date | null,
        actionType: null as string | null,
    })
    const [users, setUsers] = useState<UserOption[]>([])
    const toast = useRef<Toast>(null)

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    useEffect(() => {
        fetchLogs()
        fetchUsers()
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
            setFilteredLogs(data) // Definindo logs filtrados como todos inicialmente
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

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users", {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const data = await response.json()
            const userOptions = data.map((user: any) => ({
                label: user.username,
                value: user.id,
            }))
            setUsers(userOptions)
        } catch (error) {
            console.error("Erro ao buscar usuários:", error)
        }
    }

    const filterLogs = () => {
        let filtered = logs

        if (filters.text) {
            filtered = filtered.filter(
                (log) =>
                    log.action.toLowerCase().includes(filters.text.toLowerCase()) ||
                    log.type.toLowerCase().includes(filters.text.toLowerCase()) ||
                    log.user.username.toLowerCase().includes(filters.text.toLowerCase())
            )
        }

        if (filters.user) {
            filtered = filtered.filter((log) => log.userId === filters.user)
        }

        if (filters.actionType) {
            filtered = filtered.filter((log) => log.type === filters.actionType)
        }

        // Filtro por intervalo de datas
        if (filters.startDate && filters.endDate) {
            filtered = filtered.filter((log) => {
                const logDate = new Date(log.createdAt)
                return logDate >= filters.startDate && logDate <= filters.endDate
            })
        }

        setFilteredLogs(filtered)
    }

    const exportToPDF = () => {
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text("Relatório de Logs de Ações", 14, 22)

        const pdfData = logs.map((log) => [
            log.user.username,
            log.action,
            log.type,
            new Date(log.createdAt).toLocaleDateString(),
            new Date(log.updatedAt).toLocaleDateString(),
        ])

        const headers = ["Usuário", "Ação", "Tipo", "Data de Criação", "Data de Atualização"]

        autoTable(doc, {
            head: [headers],
            body: pdfData,
            startY: 30,
            theme: "grid",
        })

        doc.save("relatorio_logs_acoes.pdf")
    }

    const exportToExcel = () => {
        const excelData = logs.map((log) => ({
            Usuário: log.user.username,
            Ação: log.action,
            Tipo: log.type,
            "Data de Criação": new Date(log.createdAt).toLocaleDateString(),
            "Data de Atualização": new Date(log.updatedAt).toLocaleDateString(),
        }))

        const worksheet = XLSX.utils.json_to_sheet(excelData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Logs de Ações")

        XLSX.writeFile(workbook, "relatorio_logs_acoes.xlsx")
    }

    useEffect(() => {
        filterLogs()
    }, [filters])

    if (loading) {
        return (
            <div className={styles.skeletonContainer}>
                <Skeleton shape="rectangle" width="100%" height="100vh" />
            </div>
        )
    }

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

    const rightToolbarTemplate = () => {
        return (
            <div className="flex justify-between w-full">
                <InputText
                    id="globalFilter"
                    placeholder="Pesquisar"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, text: e.target.value })}
                    style={{
                        width: "250px",
                    }}
                />
                <Calendar
                    placeholder="Data inicial"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.value as Date })}
                    className="ml-2"
                    showIcon
                    style={{
                        width: "200px",
                        marginLeft: "40px",
                    }}
                    dateFormat="dd/mm/yy" // Define o formato da data
                />
                <Calendar
                    placeholder="Data final"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.value as Date })}
                    className="ml-2"
                    showIcon
                    style={{
                        width: "200px",
                        marginLeft: "40px",
                    }}
                    dateFormat="dd/mm/yy" // Define o formato da data
                />

                <Dropdown
                    value={filters.user}
                    options={users}
                    onChange={(e) => setFilters({ ...filters, user: e.value })}
                    placeholder="Selecionar Usuário"
                    className="ml-2"
                    style={{
                        width: "200px",
                        marginLeft: "40px",
                    }}
                />

                <Dropdown
                    value={filters.actionType}
                    options={logTypes}
                    onChange={(e) => setFilters({ ...filters, actionType: e.value })}
                    placeholder="Tipo de Ação"
                    className="ml-2"
                    style={{
                        width: "150px",
                        marginLeft: "40px",
                    }}
                />

                <Button
                    label="Exportar Excel"
                    icon="pi pi-file-excel"
                    style={{
                        marginLeft: "10px",
                        backgroundColor: "#f8f9fa",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        outline: "none",
                        color: "#007bff",
                        fontSize: "14px",
                        fontWeight: "bold",
                        transition: "background-color 0.3s ease",
                    }}
                    className="p-button-info"
                    onClick={exportToExcel}
                />
                <Button
                    label="Exportar PDF"
                    icon="pi pi-file-pdf"
                    style={{
                        marginLeft: "10px",
                        backgroundColor: "#f8f9fa",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        outline: "none",
                        color: "#dc3545",
                        fontSize: "14px",
                        fontWeight: "bold",
                        transition: "background-color 0.3s ease",
                    }}
                    className="p-button-danger"
                    onClick={exportToPDF}
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
                <DataTable value={filteredLogs} paginator rows={7} rowsPerPageOptions={[7, 10, 25, 50]}>
                    <Column align="center" field="action" header="Ação" sortable></Column>
                    <Column
                        align="center"
                        field="type"
                        header="Tipo"
                        sortable
                        body={(rowData) => (
                            <span
                                style={{
                                    padding: "0.5em 1em",
                                    borderRadius: "1em",
                                    display: "inline-block",
                                    ...getBadgeStyle(rowData.type),
                                }}
                            >
                                {rowData.type}
                            </span>
                        )}
                    ></Column>

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
                </DataTable>
            </div>
        </>
    )
}
