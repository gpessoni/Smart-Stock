"use client"

import DeleteButton from "@/components/Forms/DeleteButton"
import Navbar from "@/components/Navbar"
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
import styles from "./../page.module.css"
import autoTable from "jspdf-autotable"
import jsPDF from "jspdf"
import * as XLSX from "xlsx"

type Product = {
    id: string | null
    code: string
    image?: string
    description: string
    typeProductId: string | null
    groupProductId: string | null
    groupProduct?: GroupProduct
    typeProduct?: ProductType
    unitOfMeasure?: UnitOfMeasure
    unitOfMeasureId: string | null
    createdAt?: Date
    updatedAt?: Date
    ProductStorageBalances: any | null
}

type ProductType = {
    id: string | null
    description: string
    createdAt?: Date
    updatedAt?: Date
}

type UnitOfMeasure = {
    id: string | null
    abbreviation: string
    description: string
    createdAt?: Date
    updatedAt?: Date
}

type GroupProduct = {
    id: string | null
    code: string
    description: string
    createdAt?: Date
    updatedAt?: Date
}

type DropdownOption = {
    label: string
    value: string
}

export default function Products() {
    const [loading, setLoading] = useState<boolean>(true)
    const [products, setProducts] = useState<Product[]>([])
    const [productDialog, setProductDialog] = useState<boolean>(false)
    const [product, setProduct] = useState<Product>({
        id: null,
        code: "",
        description: "",

        typeProductId: null,
        groupProductId: null,
        unitOfMeasureId: null,
        ProductStorageBalances: null,
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [typeProductOptions, setTypeProductOptions] = useState<DropdownOption[]>([])
    const [groupProductOptions, setGroupProductOptions] = useState<DropdownOption[]>([])
    const [unitMeasureOptions, setUnitMeasureOptions] = useState<DropdownOption[]>([])

    const [image, setImage] = useState(null as any)

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        name: { value: null, matchMode: "contains" },
        createdAt: { value: null, matchMode: "contains" },
        updatedAt: { value: null, matchMode: "contains" },
    })

    const [visible, setVisible] = useState(false)
    const toast = useRef<Toast>(null)

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    useEffect(() => {
        fetchProducts()
        fetchDropdownOptions()
        setLoading(false)
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products", {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            console.error("Erro ao buscar produtos:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar produtos", life: 3000 })
        }
    }

    const fetchDropdownOptions = async () => {
        try {
            const [typeProducts, groupProducts, unitMeasures] = await Promise.all([
                fetch("/api/product-types", {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }).then((res) => res.json()),
                fetch("/api/product-groups", {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }).then((res) => res.json()),
                fetch("/api/unit-measure", {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }).then((res) => res.json()),
            ])

            setTypeProductOptions(typeProducts.map((tp: any) => ({ label: tp.description, value: tp.id })))
            setGroupProductOptions(groupProducts.map((gp: any) => ({ label: gp.description, value: gp.id })))
            setUnitMeasureOptions(unitMeasures.map((um: any) => ({ label: um.description, value: um.id })))
        } catch (error) {
            console.error("Erro ao buscar opções de dropdown:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao buscar opções", life: 3000 })
        }
    }

    const handleImageChange = (e: any) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const exportToPDF = () => {
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text("Detalhes dos Produtos", 14, 22)

        const pdfData = products.map((product) => {
            const totalSaldo = product.ProductStorageBalances
                ? product.ProductStorageBalances.reduce((acc: number, balance: any) => acc + (balance.balance || 0), 0)
                : 0

            return [
                product.code,
                product.description,
                product.groupProduct?.description || "N/A",
                product.typeProduct?.description || "N/A",
                product.unitOfMeasure?.abbreviation || "N/A",
                totalSaldo,
            ]
        })

        const headers = ["Código", "Descrição", "Grupo", "Tipo", "Unidade de Medida", "Saldo Total"]

        autoTable(doc, {
            head: [headers],
            body: pdfData,
            startY: 30,
            theme: "grid",
        })

        doc.save("detalhes_produtos.pdf")
    }

    const exportToExcel = () => {
        const productDetails = products.map((product) => ({
            ID: product.id,
            Código: product.code,
            Descrição: product.description,
            Grupo: product.groupProduct?.description || "N/A",
            Tipo: product.typeProduct?.description || "N/A",
            "Unidade de Medida": product.unitOfMeasure?.abbreviation || "N/A",
        }))

        const storageBalances = products.flatMap(
            (product) =>
                product.ProductStorageBalances?.map((balance: any) => ({
                    Produto: product.description,
                    Endereço: balance.storageAddress?.address || "N/A",
                    Descrição: balance.storageAddress?.description || "N/A",
                    Saldo: balance.balance || 0,
                    "Última Atualização": new Date(balance.updatedAt).toLocaleDateString(),
                })) || []
        )

        const workbook = XLSX.utils.book_new()
        const productSheet = XLSX.utils.json_to_sheet(productDetails)
        const balancesSheet = XLSX.utils.json_to_sheet(storageBalances)

        XLSX.utils.book_append_sheet(workbook, productSheet, "Detalhes dos Produtos")
        XLSX.utils.book_append_sheet(workbook, balancesSheet, "Saldos de Armazenamento")

        XLSX.writeFile(workbook, "detalhes_produtos.xlsx")
    }

    const leftToolbarTemplate = () => {
        return (
            <div className="flex justify-between w-full">
                <Button label="Novo" icon="pi pi-user-plus" className="p-button-success" onClick={openNew} />
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

    const openNew = () => {
        setProduct({ id: null, code: "", description: "", typeProductId: null, groupProductId: null, unitOfMeasureId: null, ProductStorageBalances: null })
        setSubmitted(false)
        setImage(null)
        setProductDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setProductDialog(false)
    }

    const saveProduct = async () => {
        setSubmitted(true)

        if (product.code.trim() && product.description.trim() && product.typeProductId && product.groupProductId && product.unitOfMeasureId) {
            let _products = [...products]
            try {
                console.log("Payload enviado:", JSON.stringify(product))

                const isUpdating = !!product.id
                const payload = {
                    code: product.code,
                    description: product.description,
                    typeProductId: product.typeProductId,
                    groupProductId: product.groupProductId,
                    unitOfMeasureId: product.unitOfMeasureId,
                    image: image ? image.split(",")[1] : null,
                }

                const response = await fetch(isUpdating ? `/api/products/${product.id}` : "/api/products", {
                    method: isUpdating ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                    body: JSON.stringify(payload),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar produto"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _products.push(result)
                } else {
                    const index = _products.findIndex((p) => p.id === product.id)
                    _products[index] = result
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Produto atualizado com sucesso" : "Produto criado com sucesso",
                    life: 3000,
                })

                setProducts(_products)
                fetchProducts()
                setProductDialog(false)
                setProduct({
                    id: null,
                    code: "",
                    description: "",
                    typeProductId: null,
                    groupProductId: null,
                    unitOfMeasureId: null,
                    ProductStorageBalances: null,
                })
            } catch (error) {
                console.error("Erro ao salvar produto:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar produto"
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

    const editProduct = (product: Product) => {
        setProduct({ ...product })
        setImage(`data:image/jpeg;base64,${product.image}`)
        setProductDialog(true)
    }

    const deleteProduct = async (product: Product) => {
        try {
            const response = await fetch(`/api/products/${product.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })

            if (response.ok) {
                let _products = products.filter((val) => val.id !== product.id)
                setProducts(_products)
                toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Produto deletado com sucesso", life: 3000 })
            } else {
                throw new Error("Erro ao deletar produto")
            }
        } catch (error) {
            console.error("Erro ao deletar produto:", error)
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Erro ao deletar produto", life: 3000 })
        }
    }

    const viewBalances = (product: Product) => {
        setProduct(product)
        setVisible(true)
    }

    const calculateTotalBalance = (balances: any[]) => {
        if (!balances) return 0
        return balances.reduce((total, item) => total + item.balance, 0)
    }

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveProduct} />
        </>
    )

    if (loading) {
        return (
            <div className={styles.skeletonContainer}>
                <Skeleton shape="rectangle" width="100%" height="100vh" />
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable
                    header="Produtos"
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters as DataTableFilterMeta)}
                    style={{
                        width: "100%",
                        overflow: "auto",
                        border: "1px solid #ccc",
                    }}
                    value={products}
                    paginator
                    rows={7}
                    rowsPerPageOptions={[7, 10, 25, 50]}
                >
                    <Column
                        header="Imagem"
                        body={(rowData) => {
                            const imageSrc = rowData.image ? `data:image/jpeg;base64,${rowData.image}` : ""
                            return (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "80px",
                                        width: "80px",
                                        backgroundColor: rowData.image ? "transparent" : "#f0f0f0",
                                        borderRadius: "4px",
                                        overflow: "hidden",
                                    }}
                                >
                                    {rowData.image ? (
                                        <img src={imageSrc} alt={rowData.description} style={{ maxWidth: "100%", maxHeight: "100%" }} />
                                    ) : (
                                        <i className="pi pi-image" style={{ fontSize: "2em", color: "#888" }}></i>
                                    )}
                                </div>
                            )
                        }}
                    ></Column>

                    <Column field="code" header="Código"></Column>
                    <Column field="description" header="Descrição"></Column>
                    <Column field="typeProduct.description" header="Tipo de Produto"></Column>
                    <Column field="groupProduct.description" header="Grupo de Produto"></Column>
                    <Column field="unitOfMeasure.description" header="Unidade de Medida"></Column>
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
                        field="updatedAt"
                        header="Data de Atualização"
                        body={(rowData) => {
                            const date = new Date(rowData.updatedAt)
                            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                        }}
                        sortable
                    ></Column>
                    <Column
                        header="Ações"
                        body={(rowData) => {
                            return (
                                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                                    <Button
                                        icon="pi pi-list"
                                        value="Ver Saldos"
                                        style={{
                                            marginRight: "15px",
                                        }}
                                        className="p-button-rounded p-button-info"
                                        onClick={() => viewBalances(rowData)}
                                    />
                                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                                    <DeleteButton
                                        item={rowData}
                                        onDelete={deleteProduct}
                                        message={`Você tem certeza que deseja deletar o Produto ${rowData.description}?`}
                                        header="Confirmação"
                                    />
                                </div>
                            )
                        }}
                    ></Column>
                </DataTable>
                <Dialog
                    visible={productDialog}
                    style={{
                        width: "40vw",
                    }}
                    header="Produto"
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={hideDialog}
                >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                        <label
                            htmlFor="image-upload"
                            style={{
                                cursor: "pointer",
                                borderRadius: "50%",
                                overflow: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100px",
                                height: "100px",
                                backgroundColor: image ? "transparent" : "#f0f0f0",
                            }}
                        >
                            {image ? (
                                <img src={image} alt="Produto" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <i className="pi pi-image" style={{ fontSize: "2em", color: "#888" }}></i>
                            )}
                            <input id="image-upload" type="file" accept="image/png, image/jpeg" style={{ display: "none" }} onChange={handleImageChange} />
                        </label>
                    </div>

                    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="code" style={{ marginBottom: "0.5rem", display: "block" }}>
                            Código
                        </label>
                        <InputText id="code" value={product.code} onChange={(e) => setProduct({ ...product, code: e.target.value })} required />
                        {submitted && !product.code && <small className="p-invalid">Código é obrigatório.</small>}
                    </div>

                    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="description" style={{ marginBottom: "0.5rem", display: "block" }}>
                            Descrição
                        </label>
                        <InputText
                            id="description"
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            required
                        />
                        {submitted && !product.description && <small className="p-invalid">Descrição é obrigatória.</small>}
                    </div>

                    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="typeProductId" style={{ marginBottom: "0.5rem", display: "block" }}>
                            Tipo de Produto
                        </label>
                        <Dropdown
                            id="typeProductId"
                            value={product.typeProductId}
                            options={typeProductOptions}
                            onChange={(e) => setProduct({ ...product, typeProductId: e.value })}
                            placeholder="Selecione o Tipo de Produto"
                        />
                        {submitted && !product.typeProductId && <small className="p-invalid">Tipo de Produto é obrigatório.</small>}
                    </div>

                    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="groupProductId" style={{ marginBottom: "0.5rem", display: "block" }}>
                            Grupo de Produto
                        </label>
                        <Dropdown
                            id="groupProductId"
                            value={product.groupProductId}
                            options={groupProductOptions}
                            onChange={(e) => setProduct({ ...product, groupProductId: e.value })}
                            placeholder="Selecione o Grupo de Produto"
                        />
                        {submitted && !product.groupProductId && <small className="p-invalid">Grupo de Produto é obrigatório.</small>}
                    </div>

                    <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="unitOfMeasureId" style={{ marginBottom: "0.5rem", display: "block" }}>
                            Unidade de Medida
                        </label>
                        <Dropdown
                            id="unitOfMeasureId"
                            value={product.unitOfMeasureId}
                            options={unitMeasureOptions}
                            onChange={(e) => setProduct({ ...product, unitOfMeasureId: e.value })}
                            placeholder="Selecione a Unidade de Medida"
                        />
                        {submitted && !product.unitOfMeasureId && <small className="p-invalid">Unidade de Medida é obrigatória.</small>}
                    </div>
                </Dialog>

                <Dialog header={"Saldos do Produto  " + product.description} visible={visible} style={{ width: "50vw" }} onHide={() => setVisible(false)}>
                    <h3>Saldo Total: {calculateTotalBalance(product.ProductStorageBalances)}</h3>
                    {product && (
                        <div>
                            <DataTable value={product.ProductStorageBalances} responsiveLayout="scroll">
                                <Column field="storageAddress.address" header="Armazém"></Column>
                                <Column field="balance" header="Saldo"></Column>
                            </DataTable>
                        </div>
                    )}
                </Dialog>

                <ConfirmDialog />
            </div>
        </>
    )
}
