import { PUBLIC_API_BASE_URL } from '$env/static/public';

export interface DashboardStats {
  totalUsers: number;
  totalPayments: number;
  totalCourses: number;
  totalMhs: number;
}

export interface RecentActivity {
  id: string;
  type: 'user' | 'payment' | 'course' | 'mahasiswa';
  message: string;
  time: string;
  createdAt: string;
}

class DashboardAPI {
  private baseUrl = PUBLIC_API_BASE_URL;

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Fetch data from multiple endpoints in parallel
      const [usersResponse, paymentsResponse, mahasiswaResponse] = await Promise.all([
        fetch(`${this.baseUrl}/users`),
        fetch(`${this.baseUrl}/payment`),
        fetch(`${this.baseUrl}/mahasiswa`)
      ]);

      const users = usersResponse.ok ? await usersResponse.json() : [];
      const payments = paymentsResponse.ok ? await paymentsResponse.json() : [];
      const mahasiswas = mahasiswaResponse.ok ? await mahasiswaResponse.json() : [];

      return {
        totalUsers: users.length,
        totalPayments: payments.length,
        totalCourses: 0, // Placeholder - will be implemented when courses module is ready
        totalMhs: mahasiswas.length
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalUsers: 0,
        totalPayments: 0,
        totalCourses: 0,
        totalMhs: 0
      };
    }
  }

  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      // Fetch recent data from multiple endpoints
      const [usersResponse, paymentsResponse, mahasiswaResponse] = await Promise.all([
        fetch(`${this.baseUrl}/users`),
        fetch(`${this.baseUrl}/payment`),
        fetch(`${this.baseUrl}/mahasiswa`)
      ]);

      const users = usersResponse.ok ? await usersResponse.json() : [];
      const payments = paymentsResponse.ok ? await paymentsResponse.json() : [];
      const mahasiswas = mahasiswaResponse.ok ? await mahasiswaResponse.json() : [];

      const activities: RecentActivity[] = [];

      // Add recent users
      users.slice(0, 3).forEach((user: any) => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user',
          message: `User baru ditambahkan: ${user.name}`,
          time: this.formatTimeAgo(user.createdAt),
          createdAt: user.createdAt
        });
      });

      // Add recent payments
      payments.slice(0, 3).forEach((payment: any) => {
        const amount = payment.totalPayment ? this.formatCurrency(payment.totalPayment) : 'Rp 0';
        activities.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          message: `Payment baru: ${payment.paymentCode} - ${amount}`,
          time: this.formatTimeAgo(payment.createdAt),
          createdAt: payment.createdAt
        });
      });

      // Add recent mahasiswas
      mahasiswas.slice(0, 3).forEach((mahasiswa: any) => {
        activities.push({
          id: `mahasiswa-${mahasiswa.id}`,
          type: 'mahasiswa',
          message: `Mahasiswa baru: ${mahasiswa.name} (${mahasiswa.nim})`,
          time: this.formatTimeAgo(mahasiswa.createdAt),
          createdAt: mahasiswa.createdAt
        });
      });

      // Sort by creation date (newest first) and take top 10
      return activities
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  private formatCurrency(amount: string | number): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numAmount);
  }

  private formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Baru saja';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} menit yang lalu`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} jam yang lalu`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} hari yang lalu`;
    } else {
      return date.toLocaleDateString('id-ID');
    }
  }

  async getPaymentStats(): Promise<{
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    paidCount: number;
    pendingCount: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/payment`);
      if (!response.ok) return this.getDefaultPaymentStats();

      const payments = await response.json();
      
      let totalAmount = 0;
      let paidAmount = 0;
      let pendingAmount = 0;
      let paidCount = 0;
      let pendingCount = 0;

      payments.forEach((payment: any) => {
        const amount = parseFloat(payment.totalPayment || '0');
        totalAmount += amount;
        
        if (payment.status === 'lunas') {
          paidAmount += amount;
          paidCount++;
        } else {
          pendingAmount += amount;
          pendingCount++;
        }
      });

      return {
        totalAmount,
        paidAmount,
        pendingAmount,
        paidCount,
        pendingCount
      };
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      return this.getDefaultPaymentStats();
    }
  }

  private getDefaultPaymentStats() {
    return {
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      paidCount: 0,
      pendingCount: 0
    };
  }
}

export const dashboardAPI = new DashboardAPI();