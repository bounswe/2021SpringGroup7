
import logo from "../../assets/Columbus.svg";

export default function Logo({className, alt, ...props}){
    return(<img src={logo} className={className} alt={alt} {...props} />);
}