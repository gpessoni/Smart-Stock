"use client"

import DeleteButton from "@/components/Forms/DeleteButton"
import Navbar from "@/components/Navbar"
import "primeicons/primeicons.css"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { ConfirmDialog } from "primereact/confirmdialog"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { Skeleton } from "primereact/skeleton"
import { Toast } from "primereact/toast"
import { Toolbar } from "primereact/toolbar"
import { useEffect, useRef, useState } from "react"
import styles from "./../page.module.css"

type UnitMeasurement = {
    id: string | null
    abbreviation: string
    description: string
    createdAt?: Date
    updatedAt?: Date
}

export default function UnitsMeasurement() {
    const [loading, setLoading] = useState<boolean>(true)
    const [groups, setUnitMeasurements] = useState<UnitMeasurement[]>([])
    const [groupDialog, setUnitMeasurementDialog] = useState<boolean>(false)
    const [group, setUnitMeasurement] = useState<UnitMeasurement>({
        id: null,
        abbreviation: "",
        description: "",
    })
    const [submitted, setSubmitted] = useState<boolean>(false)
    const toast = useRef<Toast>(null)

    const getAuthToken = () => {
        return localStorage.getItem("authToken") || ""
    }

    useEffect(() => {
        fetchUnitMeasurements()
        setLoading(false)
    }, [])

    const fetchUnitMeasurements = async () => {
        try {
            const response = await fetch("/api/unit-measure", {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })
            const data = await response.json()
            setUnitMeasurements(data)
        } catch (error) {
            console.error("Erro ao buscar Unidades de Medida:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao buscar Unidades de Medida",
                life: 3000,
            })
        }
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
                <InputText id="abbreviation" placeholder="Pesquisar" className="ml-2" />
            </div>
        )
    }

    const openNew = () => {
        setUnitMeasurement({ id: null, abbreviation: "", description: "" })
        setSubmitted(false)
        setUnitMeasurementDialog(true)
    }

    const hideDialog = () => {
        setSubmitted(false)
        setUnitMeasurementDialog(false)
    }

    const saveUnitMeasurement = async () => {
        setSubmitted(true)

        if (group.abbreviation.trim() && group.description.trim()) {
            let _groups = [...groups]
            try {
                console.log("Payload enviado:", JSON.stringify(group))

                const isUpdating = !!group.id
                const response = await fetch(isUpdating ? `/api/unit-measure/${group.id}` : "/api/unit-measure", {
                    method: isUpdating ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                    body: JSON.stringify({
                        abbreviation: group.abbreviation,
                        description: group.description,
                    }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorMessage = errorData.error || "Erro ao salvar Unidade de Medida"
                    throw new Error(errorMessage)
                }

                const result = await response.json()
                if (!isUpdating) {
                    _groups.push(result)
                } else {
                    _groups[_groups.findIndex((g) => g.id === group.id)] = result
                }

                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: isUpdating ? "Unidade de Medida atualizada com sucesso" : "Unidade de Medida criada com sucesso",
                    life: 3000,
                })
                setUnitMeasurements(_groups)
                setUnitMeasurementDialog(false)
                setUnitMeasurement({ id: null, abbreviation: "", description: "" })
            } catch (error) {
                console.error("Erro ao salvar Unidade de Medida:", error)
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar Unidade de Medida"
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

    const editUnitMeasurement = (group: UnitMeasurement) => {
        setUnitMeasurement({ ...group })
        setUnitMeasurementDialog(true)
    }

    const deleteUnitMeasurement = async (group: UnitMeasurement) => {
        try {
            const response = await fetch(`/api/unit-measure/${group.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            })

            if (response.ok) {
                let _groups = groups.filter((val) => val.id !== group.id)
                setUnitMeasurements(_groups)
                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Unidade de Medida deletada com sucesso",
                    life: 3000,
                })
            } else {
                throw new Error("Erro ao deletar Unidade de Medida")
            }
        } catch (error) {
            console.error("Erro ao deletar Unidade de Medida:", error)
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro ao deletar Unidade de Medida",
                life: 3000,
            })
        }
    }

    const groupDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={saveUnitMeasurement} />
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
                    header="Unidades de Medida de Produtos"
                    style={{
                        width: "100%",
                        overflow: "auto",
                        border: "1px solid #ccc",
                    }}
                    value={groups}
                    paginator
                    rows={7}
                    rowsPerPageOptions={[7, 10, 25, 50]}
                >
                    <Column align="center" field="abbreviation" header="Unidade de Médida" sortable></Column>
                    <Column align="center" field="description" header="Descrição" sortable></Column>
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
                        align="center"
                        body={(rowData: UnitMeasurement) => (
                            <>
                                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUnitMeasurement(rowData)} />
                                <DeleteButton
                                    item={rowData}
                                    onDelete={deleteUnitMeasurement}
                                    message={`Você tem certeza que deseja deletar o Unidade de Medida ${rowData.description}?`}
                                    header="Confirmação"
                                />
                            </>
                        )}
                    />
                </DataTable>

                <Dialog
                    visible={groupDialog}
                    style={{ width: "450px" }}
                    header="Detalhes do Unidade de Medida"
                    modal
                    className="p-fluid"
                    footer={groupDialogFooter}
                    onHide={hideDialog}
                >
                    <div className="field">
                        <label htmlFor="abbreviation">Unidade de Medida</label>
                        <InputText
                            style={{
                                marginTop: "10px",
                            }}
                            id="abbreviation"
                            value={group.abbreviation}
                            onChange={(e) => setUnitMeasurement({ ...group, abbreviation: e.target.value })}
                            required
                            autoFocus
                            className={submitted && !group.abbreviation ? "p-invalid" : ""}
                        />
                    </div>

                    <div
                        className="field"
                        style={{
                            marginTop: "10px",
                        }}
                    >
                        <label htmlFor="description">Descrição</label>
                        <InputText
                            id="description"
                            value={group.description}
                            onChange={(e) => setUnitMeasurement({ ...group, description: e.target.value })}
                            style={{
                                marginTop: "10px",
                            }}
                            required
                            className={submitted && !group.description ? "p-invalid" : ""}
                        />
                    </div>
                </Dialog>
                <ConfirmDialog />
            </div>
        </>
    )
}
