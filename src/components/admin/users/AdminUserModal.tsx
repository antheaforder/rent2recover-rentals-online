
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAdmin: AdminUser | null;
}

const AdminUserModal = ({ isOpen, onClose, onSuccess, editingAdmin }: AdminUserModalProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const { createAdmin, updateAdmin } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (editingAdmin) {
      setUsername(editingAdmin.username);
      setEmail(editingAdmin.email);
      setRole(editingAdmin.role);
      setIsActive(editingAdmin.is_active);
      setPassword(''); // Don't pre-fill password for editing
    } else {
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('admin');
      setIsActive(true);
    }
  }, [editingAdmin, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (editingAdmin) {
        // Update existing admin
        const updateData: any = { username, email, role, is_active: isActive };
        if (password) {
          updateData.password = password;
        }
        result = await updateAdmin(editingAdmin.id, updateData);
      } else {
        // Create new admin
        if (!password) {
          toast({
            title: "Error",
            description: "Password is required for new admin users",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        result = await createAdmin({ username, email, password, role });
      }

      if (result.success) {
        toast({
          title: "Success",
          description: editingAdmin ? "Admin user updated successfully" : "Admin user created successfully"
        });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingAdmin ? 'Edit Admin User' : 'Create Admin User'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password {editingAdmin && '(leave blank to keep current)'}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!editingAdmin}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is-active">Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingAdmin ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUserModal;
