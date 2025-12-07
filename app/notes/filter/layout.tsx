type Props = {
    children: React.ReactNode,
    sidebar?: React.ReactNode
}

export default function LayoutNote({ children, sidebar }: Props) {
    return (
        <div>
            <aside>{sidebar}</aside>
            <div>{children}</div>
        </div>
    )
}