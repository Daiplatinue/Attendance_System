import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Check, Trash2, AlertCircle } from "lucide-react";
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Account {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  token: string;
  type: 'student' | 'teacher' | 'parent' | 'admin';
}

interface SwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: (accountId: string) => void;
}

export function SwitchModal({ isOpen, onClose, onSwitch }: SwitchModalProps) {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    studentId: '',
    password: ''
  });

  useEffect(() => {
    const savedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    setAccounts(savedAccounts);
  }, []);

  const handleAddAccount = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        studentId: newAccount.studentId,
        password: newAccount.password
      });

      if (response.status === 200) {
        const newAccountData: Account = {
          id: newAccount.studentId,
          name: `User ${newAccount.studentId}`,
          email: `user${newAccount.studentId}@example.com`,
          token: response.data.token,
          type: response.data.type
        };
        
        const updatedAccounts = [...accounts, newAccountData];
        localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
        setAccounts(updatedAccounts);
        
        setNewAccount({ studentId: '', password: '' });
        setShowAddAccount(false);
        toast.success('Account added successfully');
        
        switch (newAccountData.type) {
          case 'student':
            navigate('/');
            break;
          case 'teacher':
            navigate('/teacher');
            break;
          case 'parent':
            navigate('/parent');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      toast.error('Failed to add account. Please check your credentials.');
      console.error('Error adding account:', error);
    }
  };

  const handleDeleteAccount = (accountId: string) => {
    try {
      const updatedAccounts = accounts.filter(account => account.id !== accountId);
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      setAccounts(updatedAccounts);
      toast.success('Account removed successfully');
    } catch (error) {
      toast.error('Failed to remove account');
      console.error('Error removing account:', error);
    }
  };

  const handleSwitch = async (accountId: string) => {
    try {
      onSwitch(accountId);
    } catch (error) {
      toast.error('Failed to switch account');
      console.error('Error switching account:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-modalColor text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Switch Account</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {accounts.length === 0 && !showAddAccount && (
            <div className="flex flex-col items-center justify-center py-6 text-gray-400">
              <AlertCircle className="h-12 w-12 mb-2" />
              <p className="text-sm">No accounts added yet</p>
            </div>
          )}

          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-900/50 hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src={account.avatar} />
                  <AvatarFallback className="bg-gray-800">{account.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-white">{account.name}</p>
                  <p className="text-sm text-gray-400">ID: {account.id}</p>
                  <p className="text-xs text-gray-500 capitalize">Type: {account.type}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-red-500/20 hover:text-red-400"
                  onClick={() => handleDeleteAccount(account.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-green-500/20 hover:text-green-400"
                  onClick={() => handleSwitch(account.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {showAddAccount ? (
            <div className="space-y-4 p-4 rounded-lg border border-gray-700 bg-gray-900/50">
              <Input
                placeholder="Student ID"
                value={newAccount.studentId}
                onChange={(e) => setNewAccount({ ...newAccount, studentId: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Input
                type="password"
                placeholder="Password"
                value={newAccount.password}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddAccount}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddAccount(false)}
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowAddAccount(true)}
              className="w-full flex items-center justify-center gap-2 bg-gray-900/50 border border-gray-700 text-white hover:bg-gray-800/70"
            >
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}