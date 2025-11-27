'use client';

import { deleteFeedback, getAllFeedback, updateFeedbackStatus } from '@/app/feedback/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter, DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Feedback, FeedbackPriority, FeedbackStatus, FeedbackType, FEEDBACK_PRIORITY_OPTIONS, FEEDBACK_STATUS_OPTIONS, FEEDBACK_TYPE_OPTIONS
} from '@/lib/feedback-types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
    AlertCircle, Bug, CheckCircle2, ChevronLeft,
    ChevronRight,
    Clock, Eye, Filter, Image as ImageIcon, Lightbulb, Loader2, MessageSquare, RefreshCw, Search, Sparkles, Trash2, User
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface FeedbackAdminClientProps {
  initialFeedback: Feedback[];
  initialTotal: number;
  stats: {
    total: number;
    pending: number;
    in_review: number;
    in_progress: number;
    resolved: number;
    by_type: Record<string, number>;
    by_priority: Record<string, number>;
  };
}

const typeIcons: Record<FeedbackType, React.ReactNode> = {
  bug: <Bug className="h-4 w-4" />,
  feature: <Sparkles className="h-4 w-4" />,
  improvement: <Lightbulb className="h-4 w-4" />,
  general: <MessageSquare className="h-4 w-4" />,
};

const typeColors: Record<FeedbackType, string> = {
  bug: 'bg-red-500/10 text-red-400 border-red-500/30',
  feature: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  improvement: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  general: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

const priorityColors: Record<FeedbackPriority, string> = {
  low: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const statusColors: Record<FeedbackStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  in_review: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  resolved: 'bg-green-500/10 text-green-400 border-green-500/30',
  closed: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  wont_fix: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export function FeedbackAdminClient({ initialFeedback, initialTotal, stats }: FeedbackAdminClientProps) {
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FeedbackType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<FeedbackPriority | 'all'>('all');
  
  // Selected feedback for detail view
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchFeedback = useCallback(async (pageNum: number = 1) => {
    setIsLoading(true);
    try {
      const result = await getAllFeedback({
        page: pageNum,
        limit,
        type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        priority: priorityFilter === 'all' ? undefined : priorityFilter,
        search: search || undefined,
      });
      setFeedback(result.data);
      setTotal(result.total);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    } finally {
      setIsLoading(false);
    }
  }, [limit, typeFilter, statusFilter, priorityFilter, search]);

  const handleSearch = useCallback(() => {
    fetchFeedback(1);
  }, [fetchFeedback]);

  const handleStatusUpdate = async (newStatus: FeedbackStatus) => {
    if (!selectedFeedback) return;
    
    setIsUpdating(true);
    try {
      const result = await updateFeedbackStatus(selectedFeedback.id, newStatus);
      if (result.success) {
        // Update local state
        setFeedback(prev => prev.map(f => 
          f.id === selectedFeedback.id 
            ? { ...f, status: newStatus }
            : f
        ));
        setSelectedFeedback(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!feedbackToDelete) return;
    
    setIsUpdating(true);
    try {
      const result = await deleteFeedback(feedbackToDelete.id);
      if (result.success) {
        setFeedback(prev => prev.filter(f => f.id !== feedbackToDelete.id));
        setTotal(prev => prev - 1);
        setIsDeleteDialogOpen(false);
        setFeedbackToDelete(null);
        if (selectedFeedback?.id === feedbackToDelete.id) {
          setIsDetailOpen(false);
          setSelectedFeedback(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete feedback:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openDetail = (item: Feedback) => {
    setSelectedFeedback(item);
    setIsDetailOpen(true);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Feedback Management
          </h1>
          <p className="text-gray-400 mt-2">Review and manage user feedback and bug reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/5 border-yellow-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-400">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-400">In Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{stats.in_review}</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-400">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{stats.in_progress}</div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-400">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search feedback..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-gray-800/50 border-gray-700"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as FeedbackType | 'all')}>
                <SelectTrigger className="w-[150px] bg-gray-800/50 border-gray-700">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Types</SelectItem>
                  {FEEDBACK_TYPE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FeedbackStatus | 'all')}>
                <SelectTrigger className="w-[150px] bg-gray-800/50 border-gray-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  {FEEDBACK_STATUS_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as FeedbackPriority | 'all')}>
                <SelectTrigger className="w-[150px] bg-gray-800/50 border-gray-700">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Priority</SelectItem>
                  {FEEDBACK_PRIORITY_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleSearch}
                className="bg-purple-600 hover:bg-purple-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>

              <Button
                onClick={() => fetchFeedback(page)}
                variant="outline"
                className="border-gray-700"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              </div>
            ) : feedback.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No feedback found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {feedback.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-gray-800/30 transition-colors cursor-pointer"
                    onClick={() => openDetail(item)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Type Icon */}
                      <div className={cn(
                        "p-2 rounded-lg flex-shrink-0",
                        typeColors[item.type]
                      )}>
                        {typeIcons[item.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white truncate">{item.title}</h3>
                          {item.screenshot_url && (
                            <ImageIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={cn("text-xs", typeColors[item.type])}>
                            {FEEDBACK_TYPE_OPTIONS.find(o => o.value === item.type)?.label}
                          </Badge>
                          <Badge className={cn("text-xs", priorityColors[item.priority])}>
                            {item.priority}
                          </Badge>
                          <Badge className={cn("text-xs", statusColors[item.status])}>
                            {FEEDBACK_STATUS_OPTIONS.find(o => o.value === item.status)?.label}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </span>
                          {item.user_email && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {item.user_email}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetail(item);
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFeedbackToDelete(item);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-800">
                <p className="text-sm text-gray-400">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchFeedback(page - 1)}
                    disabled={page === 1 || isLoading}
                    className="border-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchFeedback(page + 1)}
                    disabled={page === totalPages || isLoading}
                    className="border-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[700px] bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", typeColors[selectedFeedback.type])}>
                    {typeIcons[selectedFeedback.type]}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedFeedback.title}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Submitted {formatDistanceToNow(new Date(selectedFeedback.created_at), { addSuffix: true })}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={cn("text-sm", typeColors[selectedFeedback.type])}>
                    {FEEDBACK_TYPE_OPTIONS.find(o => o.value === selectedFeedback.type)?.label}
                  </Badge>
                  <Badge className={cn("text-sm", priorityColors[selectedFeedback.priority])}>
                    {selectedFeedback.priority} priority
                  </Badge>
                  <Badge className={cn("text-sm", statusColors[selectedFeedback.status])}>
                    {FEEDBACK_STATUS_OPTIONS.find(o => o.value === selectedFeedback.status)?.label}
                  </Badge>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
                  <div className="p-4 bg-gray-800/50 rounded-lg text-gray-300 whitespace-pre-wrap">
                    {selectedFeedback.description}
                  </div>
                </div>

                {/* Screenshot */}
                {selectedFeedback.screenshot_url && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Screenshot
                    </h4>
                    <a
                      href={selectedFeedback.screenshot_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={selectedFeedback.screenshot_url}
                        alt="Feedback screenshot"
                        className="rounded-lg border border-gray-700 max-h-80 object-contain w-full bg-gray-800"
                      />
                    </a>
                  </div>
                )}

                {/* User Info */}
                {selectedFeedback.user_email && (
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Submitted by</span>
                    </div>
                    <p className="text-white text-sm">{selectedFeedback.user_email}</p>
                  </div>
                )}

                {/* Status Update */}
                <div className="border-t border-gray-800 pt-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {FEEDBACK_STATUS_OPTIONS.map((opt) => (
                      <Button
                        key={opt.value}
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(opt.value)}
                        disabled={isUpdating || selectedFeedback.status === opt.value}
                        className={cn(
                          "border-gray-700",
                          selectedFeedback.status === opt.value && statusColors[opt.value]
                        )}
                      >
                        {selectedFeedback.status === opt.value && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setFeedbackToDelete(selectedFeedback);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="mr-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
                  className="border-gray-700"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              Delete Feedback
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this feedback? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
