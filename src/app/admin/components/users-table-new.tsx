'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronDown, ChevronUp, Mail, MapPin, Search, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getUsersWithProfilesAndSubscriptions } from '../actions';

interface UserData {
  id: string;
  email?: string;
  last_sign_in_at?: string;
  created_at?: string;
  profile: {
    full_name?: string;
    location?: string;
    work_experience_count?: number;
    education_count?: number;
    skills_count?: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
  } | null;
  resume_count: number;
}

type SortableColumns =
  | 'email'
  | 'created_at'
  | 'last_sign_in_at'
  | 'name'
  | 'location'
  | 'work_experience_count'
  | 'education_count'
  | 'skills_count'
  | 'resume_count';

interface SortConfig {
  column: SortableColumns;
  direction: 'ascending' | 'descending';
}

export default function UsersTable() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'created_at',
    direction: 'descending',
  });
  
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const data = await getUsersWithProfilesAndSubscriptions();
        setUsers(data as unknown as UserData[]);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    return users.filter((item) => {
      const email = item.email?.toLowerCase() || '';
      const name = item.profile?.full_name?.toLowerCase() || '';
      const location = item.profile?.location?.toLowerCase() || '';

      const searchLower = searchTerm.toLowerCase();
      return email.includes(searchLower) || 
             name.includes(searchLower) || 
             location.includes(searchLower);
    });
  }, [users, searchTerm]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let valA: string | number | null = '';
      let valB: string | number | null = '';

      const getDateValue = (dateString: string | undefined | null) => {
        return dateString ? new Date(dateString).getTime() : 0;
      };

      switch (sortConfig.column) {
        case 'email':
          valA = a.email || '';
          valB = b.email || '';
          break;
        case 'name':
          valA = a.profile?.full_name || '';
          valB = b.profile?.full_name || '';
          break;
        case 'location':
          valA = a.profile?.location || '';
          valB = b.profile?.location || '';
          break;
        case 'created_at':
          valA = getDateValue(a.created_at);
          valB = getDateValue(b.created_at);
          break;
        case 'last_sign_in_at':
          valA = getDateValue(a.last_sign_in_at);
          valB = getDateValue(b.last_sign_in_at);
          break;
        case 'work_experience_count':
          valA = a.profile?.work_experience_count || 0;
          valB = b.profile?.work_experience_count || 0;
          break;
        case 'education_count':
          valA = a.profile?.education_count || 0;
          valB = b.profile?.education_count || 0;
          break;
        case 'skills_count':
          valA = a.profile?.skills_count || 0;
          valB = b.profile?.skills_count || 0;
          break;
        case 'resume_count':
          valA = a.resume_count || 0;
          valB = b.resume_count || 0;
          break;
        default:
          return 0;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        const comparison = valA.localeCompare(valB);
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
      }

      return 0;
    });
  }, [filteredUsers, sortConfig]);

  const handleSort = (column: SortableColumns) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
  };

  const renderSortIcon = (column: SortableColumns) => {
    if (sortConfig.column !== column) {
      return <ChevronUp className="ml-1 h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp className="ml-1 h-4 w-4" />
      : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="text-muted-foreground">Loading users...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="text-red-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Users ({users.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">
                    <Button variant="ghost" onClick={() => handleSort('email')} className="px-0 hover:bg-transparent">
                      <Mail className="mr-2 h-4 w-4" />
                      Email {renderSortIcon('email')}
                    </Button>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <Button variant="ghost" onClick={() => handleSort('name')} className="px-0 hover:bg-transparent">
                      <User className="mr-2 h-4 w-4" />
                      Name {renderSortIcon('name')}
                    </Button>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <Button variant="ghost" onClick={() => handleSort('location')} className="px-0 hover:bg-transparent">
                      <MapPin className="mr-2 h-4 w-4" />
                      Location {renderSortIcon('location')}
                    </Button>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <Button variant="ghost" onClick={() => handleSort('resume_count')} className="px-0 hover:bg-transparent">
                      Resumes {renderSortIcon('resume_count')}
                    </Button>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <Button variant="ghost" onClick={() => handleSort('created_at')} className="px-0 hover:bg-transparent">
                      <Calendar className="mr-2 h-4 w-4" />
                      Joined {renderSortIcon('created_at')}
                    </Button>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <Button variant="ghost" onClick={() => handleSort('last_sign_in_at')} className="px-0 hover:bg-transparent">
                      Last Sign In {renderSortIcon('last_sign_in_at')}
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/25">
                      <td className="p-3">
                        <div className="font-medium">{item.email || 'No email'}</div>
                        <div className="text-xs text-muted-foreground">ID: {item.id}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">
                          {item.profile?.full_name || 'No name'}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          {item.profile?.location || 'Not specified'}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{item.resume_count}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">{formatDate(item.created_at)}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">{formatDate(item.last_sign_in_at)}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
