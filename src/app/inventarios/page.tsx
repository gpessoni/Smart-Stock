"use client"

import DeleteButton from "@/components/Forms/DeleteButton"
import Navbar from "@/components/Navbar"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import "primeicons/primeicons.css"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { ConfirmDialog } from "primereact/confirmdialog"
import { DataTable, DataTableFilterMeta } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Skeleton } from "primereact/skeleton"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { useEffect, useRef, useState } from "react"
import * as XLSX from "xlsx"

type Inventory = {
    id: string
    productId: string
    storageAddressId: string
    quantity: number
    status: string
    createdAt: string
    updatedAt: string
    product: {
        code: string
        description: string
    }
    storageAddress: {
        address: string
    }
}

type DropdownOption = {
    label: string
    value: string
}

export default function Inventories() {
    const [loading, setLoading] = useState<boolean>(true)
    const [inventories, setInventories] = useState<Inventory[]>([])

    const [visible, setVisible] = useState(false)
    const [inventoryDialog, setInventoryDialog] = useState<boolean>(false)
    const [inventory, setInventory] = useState<Inventory>({
        id: "",
        productId: "",
        storageAddressId: "",
        quantity: 0,
        status: "UNPROCESSED",
        createdAt: "",
        updatedAt: "",
        product: {
            code: "",
            description: "",
        },
        storageAddress: {
            address: "",
        },
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [productOptions, setProductOptions] = useState<DropdownOption[]>([])
    const [storageOptions, setStorageOptions] = useState<DropdownOption[]>([])
    const [storageAddressOptions, setStorageAddressOptions] = useState<DropdownOption[]>([])
    const [selectedStorageId, setSelectedStorageId] = useState<string | null>(null)

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
        fetchInventories()
        fetchProductOptions()
        fetchStorageOptions()
        setLoading(false)
    }, [])

    const fetchInventories = async () => {
        try {
            const authToken = getAuthToken()
            const response = await fetch("/api/product-inventory", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            const data = await response.json()
            setInventories(data)
        } catch (error) {
            console.error("Erro ao buscar inventários:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar inventários", life: 3000 })
        }
    }

    const fetchProductOptions = async () => {
        try {
            const authToken = getAuthToken()
            const products = await fetch("/api/products", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((res) => res.json())
            setProductOptions(products.map((p: any) => ({ label: p.description, value: p.id })))
        } catch (error) {
            console.error("Erro ao buscar produtos:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar produtos", life: 3000 })
        }
    }

    const fetchStorageOptions = async () => {
        try {
            const authToken = getAuthToken()
            const storages = await fetch("/api/storages", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((res) => res.json())
            setStorageOptions(storages.map((s: any) => ({ label: s.description, value: s.id })))
        } catch (error) {
            console.error("Erro ao buscar armazéns:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar armazéns", life: 3000 })
        }
    }

    const fetchStorageAddressOptions = async (storageId: string) => {
        try {
            const authToken = getAuthToken()
            const storage = await fetch(`/api/storages/${storageId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((res) => res.json())
            setStorageAddressOptions(storage.StorageAddress.map((sa: any) => ({ label: sa.address, value: sa.id })))
        } catch (error) {
            console.error("Erro ao buscar endereços:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar endereços", life: 3000 })
        }
    }

    const handleStorageChange = (e: any) => {
        const storageId = e.value
        setSelectedStorageId(storageId)
        fetchStorageAddressOptions(storageId)
    }

    const openNew = () => {
        setInventory({
            id: "",
            productId: "",
            storageAddressId: "",
            quantity: 0,
            status: "UNPROCESSED",
            createdAt: "",
            updatedAt: "",
            product: {
                code: "",
                description: "",
            },
            storageAddress: {
                address: "",
            },
        })
        setSubmitted(false)
        setInventoryDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setInventoryDialog(false)
    }

    const saveInventory = async () => {
        setSubmitted(true)

        if (inventory.productId && inventory.storageAddressId && inventory.quantity > 0) {
            let _inventories = [...inventories]
            try {
                const authToken = getAuthToken()
                const isUpdating = !!inventory.id
                const response = await fetch(isUpdating ? `/api/product-inventory/${inventory.id}` : "/api/product-inventory", {
                    method: isUpdating ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        productId: inventory.productId,
                        storageAddressId: inventory.storageAddressId,
                        quantity: inventory.quantity,
                    }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar inventário"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _inventories.push(result)
                } else {
                    const index = _inventories.findIndex((i) => i.id === inventory.id)
                    _inventories[index] = result
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Inventário atualizado com sucesso" : "Inventário criado com sucesso",
                    life: 3000,
                })

                setInventories(_inventories)
                setInventoryDialog(false)
                setInventory({
                    id: "",
                    productId: "",
                    storageAddressId: "",
                    quantity: 0,
                    status: "UNPROCESSED",
                    createdAt: "",
                    updatedAt: "",
                    product: {
                        code: "",
                        description: "",
                    },
                    storageAddress: {
                        address: "",
                    },
                })
            } catch (error) {
                console.error("Erro ao salvar inventário:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar inventário"
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: errorMessage,
                    life: 4000,
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

    const leftToolbarTemplate = () => {
        return (
            <div className="flex justify-between w-full">
                <Button label="Novo Inventário" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
                <Button
                    label="Processar Inventários"
                    style={{
                        marginLeft: "1em",
                    }}
                    icon="pi pi-check"
                    className="p-button-info"
                    onClick={() => {
                        setVisible(true)
                    }}
                />
            </div>
        )
    }

    const exportToPDF = () => {
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text("Relatório de Solicitações de Estoque", 14, 22)

        const pdfData = inventories.map((request) => [
            request.product.code,
            request.product.description,
            request.storageAddress.address,
            request.quantity,
            request.status,
            new Date(request.createdAt).toLocaleDateString(),
            new Date(request.updatedAt).toLocaleDateString(),
        ])

        const headers = [
            "Código do Produto",
            "Descrição do Produto",
            "Endereço de Armazenagem",
            "Quantidade",
            "Status",
            "Data de Criação",
            "Data de Atualização",
        ]

        autoTable(doc, {
            head: [headers],
            body: pdfData,
            startY: 30,
            theme: "grid",
        })

        doc.save("relatorio_solicitacoes_estoque.pdf")
    }

    const exportToExcel = () => {
        const excelData = inventories.map((request) => ({
            "Código do Produto": request.product.code,
            "Descrição do Produto": request.product.description,
            "Endereço de Armazenagem": request.storageAddress.address,
            Quantidade: request.quantity,
            Status: request.status,
            "Data de Criação": new Date(request.createdAt).toLocaleDateString(),
            "Data de Atualização": new Date(request.updatedAt).toLocaleDateString(),
        }))

        const worksheet = XLSX.utils.json_to_sheet(excelData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitações de Estoque")

        XLSX.writeFile(workbook, "relatorio_solicitacoes_estoque.xlsx")
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

    const editInventory = (inventory: Inventory) => {
        setInventory({ ...inventory })
        setInventoryDialog(true)
    }

    const deleteInventory = async (inventory: Inventory) => {
        try {
            const authToken = getAuthToken()
            const response = await fetch(`/api/product-inventory/${inventory.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })

            if (response.ok) {
                let _inventories = inventories.filter((val) => val.id !== inventory.id)
                setInventories(_inventories)
                toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Inventário deletado com sucesso", life: 3000 })
            } else {
                throw new Error("Erro ao deletar inventário")
            }
        } catch (error) {
            console.error("Erro ao deletar inventário:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao deletar inventário", life: 3000 })
        }
    }

    const processInventories = async () => {
        try {
            const authToken = getAuthToken()
            const response = await fetch("/api/product-inventory/process", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                toast.current?.show({ severity: "success", summary: "Sucesso", detail: data.message, life: 3000 })
                fetchInventories()
            } else {
                throw new Error("Erro ao processar inventários")
            }
        } catch (error) {
            console.error("Erro ao processar inventários:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao processar inventários", life: 3000 })
        }
    }

    const inventoryDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-primary" onClick={saveInventory} />
        </>
    )

    const statusBodyTemplate = (rowData: Inventory) => {
        const statusLabel = rowData.status === "PROCESSED" ? "Processado" : "Não Processado"
        return <span className={`p-tag p-tag-${rowData.status === "PROCESSED" ? "success" : "warning"}`}>{statusLabel}</span>
    }

    return (
        <>
            <Navbar />
            <div className="container">
                <Toast ref={toast} />
                <ConfirmDialog />
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate} />
                    {loading ? (
                        <Skeleton />
                    ) : (
                        <DataTable
                            filters={filters}
                            onFilter={(e) => setFilters(e.filters as DataTableFilterMeta)}
                            value={inventories}
                            paginator
                            rows={10}
                            className="datatable-responsive"
                        >
                            <Column
                                header="Imagem"
                                body={(rowData) => {
                                    const imageSrc = rowData.product.image ? `data:image/jpeg;base64,${rowData.product.image}` : ""
                                    return (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                height: "80px",
                                                width: "80px",
                                                backgroundColor: rowData.product.image ? "transparent" : "#f0f0f0",
                                                borderRadius: "4px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {rowData.product.image ? (
                                                <img src={imageSrc} alt={rowData.product.description} style={{ maxWidth: "100%", maxHeight: "100%" }} />
                                            ) : (
                                                <i className="pi pi-image" style={{ fontSize: "2em", color: "#888" }}></i>
                                            )}
                                        </div>
                                    )
                                }}
                            ></Column>

                            <Column field="product.code" header="Código" sortable />
                            <Column field="product.description" header="Descrição" sortable />
                            <Column field="storageAddress.address" header="Endereço" sortable />
                            <Column field="quantity" header="Quantidade" sortable />
                            <Column field="status" header="Status" body={statusBodyTemplate} sortable />
                            <Column
                                body={(rowData: Inventory) => (
                                    <>
                                        <Button
                                            icon="pi pi-pencil"
                                            style={{
                                                borderRadius: "300px",
                                            }}
                                            className="p-button-rounded p-button-success"
                                            onClick={() => editInventory(rowData)}
                                            disabled={rowData.status === "PROCESSED"}
                                        />
                                        <DeleteButton
                                            item={rowData}
                                            disabled={rowData.status === "PROCESSED"}
                                            onDelete={deleteInventory}
                                            message={`Você tem certeza que deseja deletar o Produto ${rowData.product.description}?`}
                                            header="Confirmação"
                                        />
                                    </>
                                )}
                            />
                        </DataTable>
                    )}
                </div>

                <Dialog
                    visible={inventoryDialog}
                    style={{ width: "450px" }}
                    header="Detalhes do Inventário"
                    modal
                    className="p-fluid"
                    footer={inventoryDialogFooter}
                    onHide={hideDialog}
                >
                    <div className="field" style={{ marginBottom: "1.5rem" }}>
                        {" "}
                        <label htmlFor="productId">Produto</label>
                        <Dropdown
                            id="productId"
                            value={inventory.productId}
                            options={productOptions}
                            onChange={(e) => setInventory({ ...inventory, productId: e.value })}
                            placeholder="Selecione um produto"
                        />
                        {submitted && !inventory.productId && <small className="p-invalid">Produto é obrigatório.</small>}
                    </div>

                    <div className="field" style={{ marginBottom: "1.5rem" }}>
                        {" "}
                        <label htmlFor="storageId">Armazém</label>
                        <Dropdown
                            id="storageId"
                            value={selectedStorageId}
                            options={storageOptions}
                            onChange={handleStorageChange}
                            placeholder="Selecione um armazém"
                        />
                        {submitted && !selectedStorageId && <small className="p-invalid">Armazém é obrigatório.</small>}
                    </div>

                    {selectedStorageId && (
                        <div className="field" style={{ marginBottom: "1.5rem" }}>
                            {" "}
                            <label htmlFor="storageAddressId">Endereço</label>
                            <Dropdown
                                filter={true}
                                emptyFilterMessage="Endereço não encontrado"
                                emptyMessage="Sem endereços para o Armazém Selecionado"
                                id="storageAddressId"
                                value={inventory.storageAddressId}
                                options={storageAddressOptions}
                                onChange={(e) => setInventory({ ...inventory, storageAddressId: e.value })}
                                placeholder="Selecione um endereço"
                            />
                            {submitted && storageAddressOptions.length === 0 && !inventory.storageAddressId && (
                                <small className="p-invalid">Endereço é obrigatório.</small>
                            )}
                        </div>
                    )}

                    <div className="field">
                        <label htmlFor="quantity">Quantidade</label>
                        <input
                            id="quantity"
                            type="number"
                            value={inventory.quantity}
                            onChange={(e) => setInventory({ ...inventory, quantity: parseInt(e.target.value) })}
                            placeholder="Digite a quantidade"
                            className={`p-inputtext p-component ${submitted && inventory.quantity <= 0 ? "p-invalid" : ""}`}
                        />
                        {submitted && inventory.quantity <= 0 && <small className="p-invalid">Quantidade deve ser maior que zero.</small>}
                    </div>
                </Dialog>

                <ConfirmDialog
                    draggable={false}
                    visible={visible}
                    accept={processInventories}
                    icon="pi pi-exclamation-triangle"
                    acceptClassName="p-button-danger"
                    acceptLabel="Sim"
                    rejectClassName="p-button-secondary"
                    rejectLabel="Não"
                    onHide={() => {
                        setVisible(false)
                    }}
                    header="Atenção"
                    message="Deseja processar o inventário? Após processado não será possível estornar o saldo"
                />
            </div>
        </>
    )
}
