import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Ticket, 
  Clock, 
  User, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  MessageSquare,
  BarChart3,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SupportTicket {
  id: number;
  ticketNumber: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  resolvedAt?: string;
  adminNotes?: string;
  isUnsubscribedUser: boolean;
}

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  byCategory: Record<string, number>;
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
};

export function SupportDashboard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const loadTickets = async () => {
    try {
      const [ticketsResponse, statsResponse] = await Promise.all([
        apiRequest('GET', '/api/admin/support/tickets'),
        apiRequest('GET', '/api/admin/support/stats')
      ]);

      const ticketsData = await ticketsResponse.json();
      const statsData = await statsResponse.json();

      if (ticketsData.success) {
        setTickets(ticketsData.tickets);
      }
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Failed to load support tickets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load support tickets',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (ticketId: number, status?: string, priority?: string) => {
    setUpdating(true);
    try {
      const response = await apiRequest('POST', `/api/admin/support/tickets/${ticketId}/update`, {
        status,
        priority,
        adminNotes: adminNotes || undefined
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Ticket Updated',
          description: 'Support ticket has been updated successfully'
        });
        setSelectedTicket(null);
        setAdminNotes('');
        loadTickets();
      } else {
        toast({
          title: 'Update Failed',
          description: result.message || 'Failed to update ticket',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to update ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to update ticket',
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <Ticket className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.open}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</p>
                </div>
                <RefreshCw className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Manage and respond to customer support requests</CardDescription>
            </div>
            <Button onClick={loadTickets} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No support tickets found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm font-medium text-purple-600 dark:text-purple-400">
                          {ticket.ticketNumber}
                        </span>
                        <Badge className={statusColors[ticket.status]}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={priorityColors[ticket.priority]}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                        {ticket.isUnsubscribedUser && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Unsubscribed User
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {ticket.subject}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {ticket.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {ticket.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDistanceToNow(new Date(ticket.submittedAt), { addSuffix: true })}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Category:</span> {ticket.category.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setAdminNotes(ticket.adminNotes || '');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                      
                      <Button
                        onClick={() => window.open(`mailto:${ticket.email}?subject=Re: ${ticket.subject} (${ticket.ticketNumber})`)}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket Management Modal */}
      {selectedTicket && (
        <Card className="fixed inset-0 z-50 m-4 overflow-auto bg-white dark:bg-gray-900 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manage Ticket {selectedTicket.ticketNumber}</CardTitle>
                <CardDescription>Update status, priority, and add admin notes</CardDescription>
              </div>
              <Button
                onClick={() => setSelectedTicket(null)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Ticket Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedTicket.name}</div>
                  <div><span className="font-medium">Email:</span> {selectedTicket.email}</div>
                  <div><span className="font-medium">Category:</span> {selectedTicket.category.replace('_', ' ').toUpperCase()}</div>
                  <div><span className="font-medium">Submitted:</span> {new Date(selectedTicket.submittedAt).toLocaleString()}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Current Status</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge className={statusColors[selectedTicket.status]}>
                      {selectedTicket.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={priorityColors[selectedTicket.priority]}>
                      {selectedTicket.priority.toUpperCase()}
                    </Badge>
                  </div>
                  {selectedTicket.isUnsubscribedUser && (
                    <div className="text-sm text-orange-600 dark:text-orange-400">
                      ⚠️ This user has unsubscribed from emails
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subject and Message */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Subject</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                {selectedTicket.subject}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Message</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded whitespace-pre-wrap">
                {selectedTicket.message}
              </div>
            </div>

            {/* Management Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Update Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => updateTicket(selectedTicket.id, 'in_progress')}
                    disabled={updating || selectedTicket.status === 'in_progress'}
                    variant={selectedTicket.status === 'in_progress' ? 'default' : 'outline'}
                    size="sm"
                  >
                    In Progress
                  </Button>
                  <Button
                    onClick={() => updateTicket(selectedTicket.id, 'resolved')}
                    disabled={updating || selectedTicket.status === 'resolved'}
                    variant={selectedTicket.status === 'resolved' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Resolve
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Update Priority
                </label>
                <Select
                  value={selectedTicket.priority}
                  onValueChange={(value) => updateTicket(selectedTicket.id, undefined, value)}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Notes
              </label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes or resolution details..."
                rows={4}
                disabled={updating}
              />
              <div className="mt-2">
                <Button
                  onClick={() => updateTicket(selectedTicket.id)}
                  disabled={updating || !adminNotes.trim()}
                  size="sm"
                >
                  Save Notes
                </Button>
              </div>
            </div>

            {selectedTicket.adminNotes && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Previous Notes</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded whitespace-pre-wrap">
                  {selectedTicket.adminNotes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}