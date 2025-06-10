
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { updateProfile, type Profile } from '@/services/userService';
import { supabase } from '@/integrations/supabase/client';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  profile: Profile | null;
}

const UserProfileModal = ({ isOpen, onClose, onSuccess, profile }: UserProfileModalProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('super_admin');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(profile.email);
      setRole(profile.role);
      setPassword(''); // Don't pre-fill password for editing
    } else {
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('super_admin');
    }
  }, [profile, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (profile) {
        // Update existing profile
        const result = await updateProfile(profile.id, {
          full_name: fullName,
          email,
          role
        });

        if (result.error) {
          throw new Error(result.error);
        }

        toast({
          title: "Success",
          description: "User profile updated successfully"
        });
      } else {
        // Create new admin user
        if (!password) {
          toast({
            title: "Error",
            description: "Password is required for new users",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        // 1. Create the user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role: role }
          }
        });

        if (authError) throw authError;

        // 2. Manually create the admin_users record
        const { error: adminError } = await supabase.from('admin_users').insert([
          {
            email: email,
            username: fullName,
            role: role === 'super_admin' ? 'super-admin' : 'admin',
            password_hash: 'managed_by_supabase_auth' // Placeholder since we use Auth
          }
        ]);

        if (adminError) throw adminError;

        toast({
          title: "Success", 
          description: "New admin user created successfully"
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
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
            {profile ? 'Edit User Profile' : 'Create New Admin User'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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

          {!profile && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : profile ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
