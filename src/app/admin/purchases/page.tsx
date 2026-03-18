import { getAllPurchases } from '@/server/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function AdminPurchasesPage() {
  const purchases = await getAllPurchases()
  
  const totalRevenue = purchases
    .filter((p: any) => p.status === 'completed')
    .reduce((sum: number, p: any) => sum + p.amount, 0)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchases</h1>
          <p className="text-muted-foreground">View all transactions</p>
        </div>
        <Card className="px-6 py-4">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</div>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Purchases ({purchases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase: any) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">{purchase.books?.title}</TableCell>
                  <TableCell>{purchase.profiles?.email}</TableCell>
                  <TableCell>${(purchase.amount / 100).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'}>
                      {purchase.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(purchase.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
