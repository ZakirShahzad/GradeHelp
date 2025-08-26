import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Search, Calendar, Users, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAssignments } from '@/hooks/useAssignments';
import { Skeleton } from '@/components/ui/skeleton';
interface AssignmentsPageProps {
  onTabChange?: (tab: string) => void;
}
export const AssignmentsPage: React.FC<AssignmentsPageProps> = ({
  onTabChange
}) => {
  const {
    assignments,
    loading,
    deleteAssignment
  } = useAssignments();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredAssignments = assignments.filter(assignment => assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) || assignment.description && assignment.description.toLowerCase().includes(searchQuery.toLowerCase()));
  const getStatusBadge = (assignment: any) => {
    const now = new Date();
    const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
    if (dueDate && dueDate < now) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (dueDate) {
      return <Badge variant="secondary">Active</Badge>;
    }
    return <Badge variant="outline">Draft</Badge>;
  };
  const handleDeleteAssignment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(id);
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };
  return <div className="min-h-screen bg-surface">
      <header className="bg-surface-elevated/95 border-b border-border backdrop-blur-md">
        
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="card-elevated mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search assignments..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Filter by Date
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assignments Grid */}
        {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Card key={i} className="card-elevated">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>)}
          </div> : filteredAssignments.length === 0 ? <div className="text-center py-12">
            <div className="p-4 bg-primary-light rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No assignments found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery ? 'No assignments match your search criteria.' : 'Create your first assignment to get started with AI-powered grading.'}
            </p>
            <Button variant="default" onClick={() => onTabChange?.('upload')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Assignment
            </Button>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map(assignment => <Card key={assignment.id} className="card-elevated hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold truncate">
                        {assignment.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(assignment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Assignment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAssignment(assignment.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  {assignment.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {assignment.description}
                    </p>}
                  
                  <div className="flex items-center justify-between mb-3">
                    {getStatusBadge(assignment)}
                    {assignment.total_points && <span className="text-sm text-muted-foreground">
                        {assignment.total_points} points
                      </span>}
                  </div>

                  {assignment.due_date && <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="mr-2 h-4 w-4" />
                      Due {new Date(assignment.due_date).toLocaleDateString()}
                    </div>}

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      0 submissions
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>}
      </div>
    </div>;
};
export default AssignmentsPage;