import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { icons } from 'lucide';

const selectedIcons = {
  // Icônes de base
  Calendar: icons.Calendar,
  CalendarDays: icons.CalendarDays,
  ChevronRight: icons.ChevronRight,
  UserPlus: icons.UserPlus,

  // Icônes pour les statistiques
  Users: icons.Users,
  DollarSign: icons.DollarSign,
  AlertTriangle: icons.AlertTriangle,
  Clock: icons.Clock,

  // Icônes pour le thème
  Sun: icons.Sun,
  Moon: icons.Moon,

  // Icônes médicales
  Stethoscope: icons.Stethoscope,
  Pill: icons.Pill,
  HeartPulse: icons.HeartPulse,
  Activity: icons.Activity,

  // Icônes pour le stock
  Box: icons.Box,
  Package: icons.Package,

  // Icônes pour le personnel
  Users2: icons.Users2,
  UserCog: icons.UserCog,
  UserCheck: icons.UserCheck,

  // Icônes pour les notifications
  Bell: icons.Bell,
  BellRing: icons.BellRing,
  BellOff: icons.BellOff,

  // Icônes pour la navigation
  LayoutDashboard: icons.LayoutDashboard,
  Home: icons.Home,
  Settings: icons.Settings,
  LogOut: icons.LogOut,
  ArrowLeft: icons.ArrowLeft,

  // Icônes pour les actions
  Plus: icons.Plus,
  Search: icons.Search,
  Filter: icons.Filter,
  MoreVertical: icons.MoreVertical,

  // Icônes pour les statuts
  Check: icons.Check,
  CheckCircle: icons.CheckCircle,
  X: icons.X,
  XCircle: icons.XCircle,
  AlertCircle: icons.AlertCircle,
  Info: icons.Info,

  // Icônes pour les fichiers et documents
  File: icons.File,
  FileText: icons.FileText,
  FileCheck: icons.FileCheck,
  FileX: icons.FileX,
  FilePlus: icons.FilePlus,
  FileMinus: icons.FileMinus,

  // Icônes supplémentaires
  MessageSquare: icons.MessageSquare,
  Printer: icons.Printer,
  Download: icons.Download,
  Upload: icons.Upload,
  RefreshCw: icons.RefreshCw,
  Trash2: icons.Trash2,
  Edit: icons.Edit,
  Eye: icons.Eye,
  Lock: icons.Lock,
  Unlock: icons.Unlock,
  Star: icons.Star,
  HelpCircle: icons.HelpCircle,
  ExternalLink: icons.ExternalLink,
  Menu: icons.Menu,
  BarChart2: icons.BarChart2,
  PieChart: icons.PieChart,
  LineChart: icons.LineChart,
  TrendingUp: icons.TrendingUp,
  TrendingDown: icons.TrendingDown,
  CreditCard: icons.CreditCard,
  Mail: icons.Mail,
  Phone: icons.Phone,
  MapPin: icons.MapPin,
  Globe: icons.Globe
};

@NgModule({
  imports: [LucideAngularModule.pick(selectedIcons)],
  exports: [LucideAngularModule]
})
export class LucideIconsModule {}
