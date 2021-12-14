import './LogoAnimated.css'
import logo from "../../assets/logo.svg";

export default function Logo({ className, alt, ...props }) {
    return ( < img src = { logo }
        className = "logo-spin"
        alt = "logo" {...props }
        height = "100" />
    );
}