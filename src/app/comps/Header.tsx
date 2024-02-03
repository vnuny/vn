import SearchBox from "./searchBox";
import '../css/header.css'
export default function Header({ onSearchChange }:any) {
    return(
        <header>
            <a href="/" className="logo">VNUN</a>
            <SearchBox onSearchChange={onSearchChange}/>
            <nav className="socialMediaIcons">
                <a href="https://www.instagram.com/vnun.y/" target="_blank">
                    <i className="fa-brands fa-instagram"></i>
                </a>
            </nav>
        </header>
    )
}