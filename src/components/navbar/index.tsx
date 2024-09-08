"use client"

import React, { useRef, useState } from "react"
import * as S from "./styled"
import { faBars, faCog, faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Navbar = () => {
    const [showOptions, setShowOptions] = useState(false)
    const [showOptionsUsers, setShowOptionsUsers] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const timerRef = useRef<any | undefined>(undefined)

    const handleMouseEnter = () => {
        setShowOptionsUsers(false)
        setShowOptions(true)
        clearTimeout(timerRef.current)
    }

    const handleMouseLeave = () => {
        timerRef.current = setTimeout(() => {
            setShowOptionsUsers(false)
            setShowOptions(false)
        }, 1000)
    }

    const handleMouseEnterUsers = () => {
        setShowOptions(false)
        setShowOptionsUsers(true)
        clearTimeout(timerRef.current)
    }

    const checkWindowSize = () => {
        setIsMobile(window.innerWidth < 1024)
    }

    React.useEffect(() => {
        checkWindowSize()
        window.addEventListener("resize", checkWindowSize)
        return () => {
            window.removeEventListener("resize", checkWindowSize)
        }
    }, [])

    return (
        <S.Navbar>
            <S.Logo>
                <img src="https://cdn-icons-png.flaticon.com/512/4947/4947506.png" alt="Logo" />
                SmartStock
            </S.Logo>
            {isMobile ? (
                <S.MenuIcon
                    onClick={() => {
                        setShowOptions(!showOptions)
                    }}
                >
                    <FontAwesomeIcon icon={faBars} />
                </S.MenuIcon>
            ) : (
                <S.NavLinks>
                    <S.NavLink href="/inventarios">Inventários</S.NavLink>
                    <S.NavLink href="/produtos">Produtos</S.NavLink>
                    <S.NavLink href="/estoques">Solicitações ao Almoxarifado</S.NavLink>
                    <S.NavLink href="/estoques">Ordens de Separação</S.NavLink>
                    <S.NavLink href="/estoques">Transferências</S.NavLink>
                </S.NavLinks>
            )}

            {!isMobile && (
                <>
                    <S.OptionsContainer onMouseLeave={handleMouseLeave}>
                        <S.UsersIcon onMouseEnter={handleMouseEnterUsers}>
                            <FontAwesomeIcon icon={faUsers} />
                        </S.UsersIcon>

                        <S.CogIcon onMouseEnter={handleMouseEnter}>
                            <FontAwesomeIcon icon={faCog} />
                        </S.CogIcon>

                        <S.OptionsMenu showOptions={showOptions}>
                            <S.OptionItem href="/armazens">Armázens e Endereços</S.OptionItem>
                            <S.OptionItem href="/grupos_produtos">Grupos de Produtos</S.OptionItem>
                            <S.OptionItem href="/tipos_produtos">Tipos de Produtos</S.OptionItem>
                            <S.OptionItem href="/unidades_medida">Unidades de Medidas</S.OptionItem>
                        </S.OptionsMenu>
                        <S.OptionsMenuUsers showOptions={showOptionsUsers}>
                            <S.OptionItem href="/usuarios">Usuários</S.OptionItem>
                            <S.OptionItem href="/permissoes">Permissões</S.OptionItem>
                            <S.OptionItem href="/departamentos">Departamentos</S.OptionItem>
                        </S.OptionsMenuUsers>
                    </S.OptionsContainer>
                </>
            )}
        </S.Navbar>
    )
}

export default Navbar
