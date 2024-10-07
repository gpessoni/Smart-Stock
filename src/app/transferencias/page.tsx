"use client"

import Navbar from "@/components/Navbar"
import { jsPDF } from "jspdf"
import "primeicons/primeicons.css"
import { Button } from "primereact/button"
import { Chip } from "primereact/chip"
import { Column } from "primereact/column"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { DataTable, DataTableFilterMeta } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import autoTable from "jspdf-autotable"
import { useEffect, useRef, useState } from "react"
import * as XLSX from "xlsx"

type Transfer = {
    id: string
    productId: string
    fromAddressId: string
    toAddressId: string
    return?: boolean
    quantity: number
    createdAt: string
    product: {
        code: string
        description: string
    }
    fromAddress: {
        address: string
    }
    toAddress: {
        address: string
    }
}

type DropdownOption = {
    label: string
    value: string
}

export default function Transfers() {
    const [loading, setLoading] = useState<boolean>(true)
    const [transfers, setTransfers] = useState<Transfer[]>([])

    const [transferDialog, setTransferDialog] = useState<boolean>(false)
    const [transfer, setTransfer] = useState<Transfer>({
        id: "",
        productId: "",
        fromAddressId: "",
        toAddressId: "",
        quantity: 0,
        createdAt: "",
        product: {
            code: "",
            description: "",
        },
        fromAddress: {
            address: "",
        },
        toAddress: {
            address: "",
        },
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [productOptions, setProductOptions] = useState<DropdownOption[]>([])
    const [storageOptions, setStorageOptions] = useState<DropdownOption[]>([])
    const [fromAddressOptions, setFromAddressOptions] = useState<DropdownOption[]>([])
    const [toAddressOptions, setToAddressOptions] = useState<DropdownOption[]>([])
    const [selectedFromStorageId, setSelectedFromStorageId] = useState<string | null>(null)
    const [selectedToStorageId, setSelectedToStorageId] = useState<string | null>(null)
    const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null)

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        name: { value: null, matchMode: "contains" },
        createdAt: { value: null, matchMode: "contains" },
        updatedAt: { value: null, matchMode: "contains" },
    })
    const toast = useRef<Toast>(null)

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    useEffect(() => {
        fetchTransfers()
        fetchProductOptions()
        fetchStorageOptions()
        setLoading(false)
    }, [])

    const fetchTransfers = async () => {
        try {
            const response = await fetch("/api/address-transfer", {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const data = await response.json()
            setTransfers(data)
        } catch (error) {
            console.error("Erro ao buscar transferências:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar transferências",
                life: 3000,
            })
        }
    }

    const fetchProductOptions = async () => {
        try {
            const products = await fetch("/api/products", {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            }).then((res) => res.json())
            setProductOptions(products.map((p: any) => ({ label: p.description, value: p.id })))
        } catch (error) {
            console.error("Erro ao buscar produtos:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar produtos",
                life: 3000,
            })
        }
    }

    const fetchStorageOptions = async () => {
        try {
            const storages = await fetch("/api/storages", {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            }).then((res) => res.json())
            setStorageOptions(storages.map((s: any) => ({ label: s.description, value: s.id })))
        } catch (error) {
            console.error("Erro ao buscar armazéns:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar armazéns",
                life: 3000,
            })
        }
    }

    const fetchAddressOptions = async (storageId: string, setOptions: any) => {
        try {
            const storage = await fetch(`/api/storages/${storageId}`, {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            }).then((res) => res.json())
            setOptions(storage.StorageAddress.map((sa: any) => ({ label: sa.address, value: sa.id })))
        } catch (error) {
            console.error("Erro ao buscar endereços:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar endereços",
                life: 3000,
            })
        }
    }

    const confirmReturn = (transfer: Transfer) => {
        setSelectedTransfer(transfer)
        confirmDialog({
            message: "Tem certeza que deseja estornar esta transferência?",
            header: "Confirmação de Estorno",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Sim",
            rejectClassName: "p-button-secondary",
            rejectLabel: "Não",
            accept: () => handleEstorno(transfer.id),
            reject: () => setSelectedTransfer(null),
        })
    }

    const handleEstorno = async (id: string) => {
        try {
            const response = await fetch(`/api/address-transfer/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify({ return: true }),
            })

            if (response.ok) {
                fetchTransfers()
                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Transferência estornada com sucesso",
                    life: 3000,
                })
            } else {
                const errorData = await response.json()
                const errorMessage = errorData.error || "Erro ao estornar transferência"
                throw new Error(errorMessage)
            }
        } catch (error) {
            console.error("Erro ao estornar transferência:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: error instanceof Error ? error.message : "Erro desconhecido ao estornar transferência",
                life: 3000,
            })
        }
    }

    const handleFromStorageChange = (e: any) => {
        const storageId = e.value
        setSelectedFromStorageId(storageId)
        fetchAddressOptions(storageId, setFromAddressOptions)
    }

    const handleToStorageChange = (e: any) => {
        const storageId = e.value
        setSelectedToStorageId(storageId)
        fetchAddressOptions(storageId, setToAddressOptions)
    }

    const openNew = () => {
        setTransfer({
            id: "",
            productId: "",
            fromAddressId: "",
            toAddressId: "",
            quantity: 0,
            createdAt: "",
            product: {
                code: "",
                description: "",
            },
            fromAddress: {
                address: "",
            },
            toAddress: {
                address: "",
            },
        })
        setSubmitted(false)
        setTransferDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setTransferDialog(false)
    }

    const saveTransfer = async () => {
        setSubmitted(true)

        if (transfer.productId && transfer.fromAddressId && transfer.toAddressId && transfer.quantity > 0) {
            const method = transfer.id ? "PATCH" : "POST"
            const url = transfer.id ? `/api/address-transfer/${transfer.id}` : "/api/address-transfer"

            const body = {
                productId: transfer.productId,
                fromAddressId: transfer.fromAddressId,
                toAddressId: transfer.toAddressId,
                quantity: transfer.quantity,
            }

            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                    body: JSON.stringify(body),
                })

                if (response.ok) {
                    const savedTransfer = await response.json()
                    setTransfers((prevTransfers) =>
                        method === "POST" ? [...prevTransfers, savedTransfer] : prevTransfers.map((t) => (t.id === savedTransfer.id ? savedTransfer : t))
                    )

                    toast.current?.show({
                        severity: "success",
                        summary: "Sucesso",
                        detail: "Transferência salva com sucesso",
                        life: 3000,
                    })
                    hideDialog()
                    fetchTransfers()
                } else {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar transferência"
                    throw new Error(errorMessage)
                }
            } catch (error) {
                console.error("Erro ao salvar transferência:", error)
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: error instanceof Error ? error.message : "Erro desconhecido ao salvar transferência",
                    life: 3000,
                })
            }
        } else {
            toast.current?.show({
                severity: "warn",
                summary: "Atenção",
                detail: "Preencha todos os campos obrigatórios.",
                life: 3000,
            })
        }
    }

    const exportToPDF = () => {
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text("Transferências", 14, 22)

        const pdfData = transfers.map((transfer) => [
            transfer.id,
            transfer.product.description,
            transfer.product.code,
            transfer.quantity,
            transfer.fromAddress.address,
            transfer.toAddress.address,
            new Date(transfer.createdAt).toLocaleDateString(),
        ])

        const headers = ["ID", "Produto", "Código do Produto", "Quantidade", "Endereço de Origem", "Endereço de Destino", "Data de Criação"]

        autoTable(doc, {
            head: [headers],
            body: pdfData,
            startY: 30,
            theme: "grid", 
        })

        doc.save("transferencias.pdf")
    }

    const exportToExcel = () => {
        const formattedData = transfers.map((transfer) => ({
            ID: transfer.id,
            Produto: transfer.product.description,
            "Código do Produto": transfer.product.code,
            Quantidade: transfer.quantity,
            "Endereço de Origem": transfer.fromAddress.address,
            "Endereço de Destino": transfer.toAddress.address,
            "Data de Criação": new Date(transfer.createdAt).toLocaleDateString(),
        }))

        const ws = XLSX.utils.json_to_sheet(formattedData)

        const header = ws["!ref"]
        for (let col in ws) {
            if (col[0] === "!") continue
            ws[col].s = {
                font: {
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                fill: {
                    fgColor: { rgb: "4F81BD" },
                },
            }
        }

        for (let cell in ws) {
            if (cell[0] === "!") continue
            ws[cell].s = {
                ...ws[cell].s,
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            }
        }

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Transferências")

        XLSX.writeFile(wb, "transferencias.xlsx")
    }

    const transferDialogFooter = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveTransfer} />
        </div>
    )

    const leftToolbarTemplate = () => {
        return (
            <div className="flex justify-between w-full">
                <Button label="Nova Transferência" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
            </div>
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
        <div>
            <Navbar />
            <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
            <DataTable
                filters={filters}
                onFilter={(e) => setFilters(e.filters as DataTableFilterMeta)}
                style={{
                    width: "100%",
                    overflow: "auto",
                    border: "1px solid #ccc",
                }}
                value={transfers}
                loading={loading}
                selectionMode="single"
            >
                <Column align="center" sortable field="product.code" header="Produto" />
                <Column align="center" sortable field="product.description" header="Descrição" />
                <Column align="center" sortable field="fromAddress.address" header="De" />
                <Column align="center" sortable field="toAddress.address" header="Para" />
                <Column align="center" sortable field="quantity" header="Quantidade" />
                <Column
                    align="center"
                    sortable
                    field="return"
                    header="Tipo"
                    body={(rowData) => {
                        return rowData.return ? <Chip label="Extornado" className="p-chip-yellow" /> : <Chip label="Transferência" className="p-chip-green" />
                    }}
                />
                <Column
                    align="center"
                    field="createdAt"
                    header="Data de Criação"
                    body={(rowData) => {
                        const date = new Date(rowData.createdAt)
                        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                    }}
                    sortable
                ></Column>
                <Column
                    align="center"
                    body={(rowData: Transfer) => (
                        <>
                            <div>
                                <Button
                                    disabled={rowData.return === true}
                                    icon="pi pi-replay"
                                    onClick={() => confirmReturn(rowData)}
                                    label="Estornar Transfêrencia"
                                    className="p-button-rounded p-button-success mr-2"
                                />
                            </div>
                        </>
                    )}
                />
            </DataTable>

            <Dialog
                visible={transferDialog}
                style={{ width: "450px" }}
                header="Detalhes da Transferência"
                modal
                className="p-fluid"
                footer={transferDialogFooter}
                onHide={hideDialog}
            >
                <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                    <Dropdown
                        value={transfer.productId}
                        options={productOptions}
                        onChange={(e) => setTransfer({ ...transfer, productId: e.value })}
                        placeholder="Selecione o Produto"
                    />
                </div>
                <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                    <Dropdown
                        value={selectedFromStorageId}
                        options={storageOptions}
                        onChange={handleFromStorageChange}
                        placeholder="Selecione o Armazém de Origem"
                    />
                </div>
                <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                    <Dropdown
                        value={transfer.fromAddressId}
                        options={fromAddressOptions}
                        onChange={(e) => setTransfer({ ...transfer, fromAddressId: e.value })}
                        placeholder="Selecione o Endereço de Origem"
                        disabled={!selectedFromStorageId}
                    />
                </div>{" "}
                <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                    <Dropdown
                        value={selectedToStorageId}
                        options={storageOptions}
                        onChange={handleToStorageChange}
                        placeholder="Selecione o Armazém de Destino"
                    />
                </div>
                <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                    <Dropdown
                        value={transfer.toAddressId}
                        options={toAddressOptions}
                        onChange={(e) => setTransfer({ ...transfer, toAddressId: e.value })}
                        placeholder="Selecione o Endereço de Destino"
                        disabled={!selectedToStorageId}
                    />
                </div>
                <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                    <InputText
                        type="number"
                        value={transfer.quantity.toString()}
                        onChange={(e) => setTransfer({ ...transfer, quantity: +e.target.value })}
                        placeholder="Quantidade"
                    />
                </div>
            </Dialog>
            <ConfirmDialog draggable={false} />
        </div>
    )
}
