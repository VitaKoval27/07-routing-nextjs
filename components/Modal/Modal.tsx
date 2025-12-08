import { createPortal } from "react-dom"
import css from "./Modal.module.css"
import { useEffect, useRef } from "react"

interface ModalProps{
    onClose:()=>void,
    children:React.ReactNode
}

export  default function Modal({onClose,children}:ModalProps){
    const modalRoot=document.getElementById("modal-root")
    const modalRef=useRef<HTMLDivElement>(null)

    useEffect(()=>
        {const hanldeKeyDown=(event:KeyboardEvent)=>{
            if (event.key==="Escape") {
                onClose()
            }
        }
        const handleClickOutside=(event:MouseEvent)=>{
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                if ((event.target as HTMLElement).classList.contains(css.backdrop)) {
                    onClose();
                }

        }}
        window.addEventListener("keydown",hanldeKeyDown)
        window.addEventListener("mousedown",handleClickOutside)
        document.body.style.overflow="hidden";

        return ()=>{
            window.removeEventListener("keydown",hanldeKeyDown)
            window.removeEventListener("mousedown",handleClickOutside)
            document.body.style.overflow=""
        }
    },[onClose])

    if (!modalRoot) {
        return null
    }
    return createPortal(
        <div className={css.backdrop}
 role="dialog"
 aria-modal="true"
 >
 <div className={css.modal} ref={modalRef}>
 {children}
 </div>
 </div>,modalRoot
    )
}
