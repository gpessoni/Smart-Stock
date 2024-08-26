import styled, { css } from "styled-components"

interface OptionsMenuProps {
    showOptions: boolean
}

export const Navbar = styled.nav`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: #fff;
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

export const Logo = styled.a`
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    margin-right: 3rem;
    color: #333;
    img {
        width: 32px;
        height: 32px;
        margin-right: 0.5rem;
    }
`

export const NavLinks = styled.div`
    display: flex;
    margin-right: 10rem;
    align-items: center;
`

export const NavLink = styled.a`
    margin-left: 2rem;
    text-decoration: none;
    color: #666;
    transition: color 0.3s ease;

    &:hover {
        color: #333;
    }
`

export const OptionsContainer = styled.div`
    position: relative;
    z-index: 1000;
`

export const OptionsContainerUsers = styled.div`
    position: relative;
    z-index: 1000;
`

export const CogIcon = styled.span`
    cursor: pointer;
`

export const MenuIcon = styled.span`
    cursor: pointer;
    display: none;
    @media (max-width: 768px) {
        display: block;
    }
`

export const OptionsMenuUsers = styled.div<OptionsMenuProps>`
    position: absolute;
    right: 0;
    background-color: #fff;
    margin-right: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem;
    margin-top: 0.7rem;
    width: 200px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0s linear 0.3s;

    ${({ showOptions }) =>
        showOptions &&
        css`
            opacity: 1;
            visibility: visible;
            transition-delay: 0s;
        `}
`

export const OptionsMenu = styled.div<OptionsMenuProps>`
    position: absolute;
    right: 0;
    background-color: #fff;
    margin-right: -1.3rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem;
    margin-top: 0.7rem;
    width: 200px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0s linear 0.3s;

    ${({ showOptions }) =>
        showOptions &&
        css`
            opacity: 1;
            visibility: visible;
            transition-delay: 0s;
        `}
`

export const OptionItem = styled.a`
    cursor: pointer;
    display: block;
    font-size: 14px;
    color: #333;
    text-decoration: none;
    padding: 0.5rem 0.8rem;
    transition: background-color 0.3s ease;
    border-bottom: 1px solid #eee;
    text-align: right; /* Alinha o texto à direita */

    &:hover {
        background-color: #f5f5f5;
    }

    &:last-child {
        border-bottom: none;
    }
`
export const UsersIcon = styled.span`
    cursor: pointer;
    margin-right: 3rem;
`
