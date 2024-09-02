"use client"

import { Button } from "primereact/button"
import { confirmDialog } from "primereact/confirmdialog"
import styled from "styled-components"

interface DeleteButtonProps {
    item: any
    onDelete: (item: any) => void
    message: string
    header: string
    disabled?: boolean
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ item, onDelete, message, header, disabled }) => {
    const confirmDelete = () => {
        confirmDialog({
            message,
            header,
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Sim",
            rejectClassName: "p-button-secondary",
            rejectLabel: "Não",
            accept: () => onDelete(item),
        })
    }

    return <StyledButton disabled={disabled} icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={confirmDelete} />
}

const StyledButton = styled(Button)`
    margin-left: 15px;
`

export default DeleteButton
