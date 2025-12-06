type Props = {
    children: React.ReactNode,
    sideBar?: React.ReactNode
}

export default function LayoutNote({ children, sideBar }: Props) {
    return (
        <div>
            <aside>{sideBar}</aside>
            <div>{children}</div>
        </div>
    )
}