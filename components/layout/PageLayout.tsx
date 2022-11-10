interface Props {
  children: React.ReactNode
}

export default function PageLayout({ children }: Props) {
  return (
    <div className="bg-gray-100">
      <main className="flex min-h-screen flex-col">{children}</main>
    </div>
  )
}
