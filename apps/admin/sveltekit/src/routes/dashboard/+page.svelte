<script lang="ts">
  import { onMount } from 'svelte';
  import { dashboardAPI, type DashboardStats, type RecentActivity } from '$lib/api';
  import Alert from '$lib/components/Alert.svelte';
  import { Icon, ICON_NAMES } from '$lib/components/icons';

  // Dynamic data - initialized with 0, will be updated from API
  let stats: DashboardStats = {
    totalUsers: 0,
    totalPayments: 0,
    totalCourses: 0,
    totalMhs: 0
  };

  let loading = true;
  let error = '';
  let recentActivities: RecentActivity[] = [];
  
  // Alert state
  let alertShow = false;
  let alertType: 'success' | 'error' | 'warning' | 'info' = 'info';
  let alertMessage = '';

  // Alert functions
  function showAlert(type: 'success' | 'error' | 'warning' | 'info', message: string) {
    alertType = type;
    alertMessage = message;
    alertShow = true;
  }

  function hideAlert() {
    alertShow = false;
  }

  async function loadDashboardData() {
    try {
      loading = true;
      
      // Load stats and activities in parallel
      const [statsData, activitiesData] = await Promise.all([
        dashboardAPI.getDashboardStats(),
        dashboardAPI.getRecentActivities()
      ]);
      
      stats = statsData;
      // Filter out activities older than 30 days to avoid cluttering the dashboard
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      const nowMs = Date.now();
      recentActivities = activitiesData.filter((activity) => {
        const createdAtMs = new Date(activity.createdAt).getTime();
        return !Number.isNaN(createdAtMs) && nowMs - createdAtMs <= THIRTY_DAYS_MS;
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showAlert('error', 'Gagal memuat data dashboard');
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadDashboardData();
  });
</script>

<div class="page-container">
  <!-- Loading State -->
  {#if loading}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading dashboard data...</p>
    </div>
  {:else}
    <!-- Fixed Header Section -->
    <div class="fixed-header">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon users">
            <Icon name={ICON_NAMES.USERS} size={24} />
          </div>
          <div class="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon lecturers">
            <Icon name={ICON_NAMES.MAHASISWA} size={24} />
          </div>
          <div class="stat-info">
            <h3>{stats.totalMhs}</h3>
            <p>Total Mahasiswa</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon payments">
            <Icon name={ICON_NAMES.PAYMENT} size={24} />
          </div>
          <div class="stat-info">
            <h3>{stats.totalPayments}</h3>
            <p>Total Payments</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon courses">
            <Icon name={ICON_NAMES.COURSE} size={24} />
          </div>
          <div class="stat-info">
            <h3>{stats.totalCourses}</h3>
            <p>Mata Kuliah</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrollable Content Section -->
    <div class="scrollable-content">
      <!-- Recent Activities -->
      <div class="activity-section">
        <div class="section-header">
          <h2>Aktivitas Terbaru</h2>
        </div>
        <div class="activity-list">
          {#each recentActivities as activity}
            <div class="activity-item">
              <div class="activity-icon {activity.type}">
                {#if activity.type === 'user'}
                  <Icon name={ICON_NAMES.USERS} size={16} />
                {:else if activity.type === 'mahasiswa'}
                  <Icon name={ICON_NAMES.MAHASISWA} size={16} />
                {:else if activity.type === 'payment'}
                  <Icon name={ICON_NAMES.PAYMENT} size={16} />
                {:else if activity.type === 'course'}
                  <Icon name={ICON_NAMES.COURSE} size={16} />
                {:else}
                  <Icon name={ICON_NAMES.USERS} size={16} />
                {/if}
              </div>
              <div class="activity-content">
                <p class="activity-message">{activity.message}</p>
                <span class="activity-time">{activity.time}</span>
              </div>
            </div>
          {/each}
          
          {#if recentActivities.length === 0}
            <div class="empty-activities">
              <p>Tidak ada aktivitas terbaru</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Alert Component -->
<Alert 
  bind:show={alertShow} 
  type={alertType} 
  message={alertMessage} 
  on:hide={hideAlert}
/>

<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 0;
  }

  .stat-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 28px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 4px 20px rgba(30, 105, 221, 0.05);
    border: 1px solid #e2e8f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(30, 105, 221, 0.1);
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .stat-icon.users { background: linear-gradient(135deg, #1E69DD, #57D4D4); }
  .stat-icon.payments { background: linear-gradient(135deg, #10b981, #34d399); }
  .stat-icon.courses { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
  .stat-icon.lecturers { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }

  .stat-info h3 {
    margin: 0 0 4px;
    font-size: 32px;
    font-weight: 700;
    color: #1E69DD;
  }

  .stat-info p {
    margin: 0;
    color: #64748b;
    font-weight: 500;
  }

  /* Activity Section */
  .activity-section {
    background: #ffffff;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 4px 20px rgba(30, 105, 221, 0.05);
    border: 1px solid #e2e8f0;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .section-header h2 {
    margin: 0 0 24px;
    font-size: 20px;
    font-weight: 700;
    color: #1E69DD;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
    border-radius: 12px;
    background: #f8fafc;
    transition: all 0.2s;
  }

  .activity-item:hover {
    background: rgba(30, 105, 221, 0.05);
  }

  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .activity-icon.user { background: linear-gradient(135deg, #1E69DD, #57D4D4); }
  .activity-icon.mahasiswa { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }
  .activity-icon.payment { background: linear-gradient(135deg, #10b981, #34d399); }
  .activity-icon.course { background: linear-gradient(135deg, #f59e0b, #fbbf24); }

  .activity-content {
    flex: 1;
  }

  .activity-message {
    margin: 0 0 4px;
    font-weight: 500;
    color: #334155;
    line-height: 1.5;
  }

  .activity-time {
    font-size: 13px;
    color: #64748b;
  }

  .empty-activities {
    text-align: center;
    padding: 40px 20px;
    color: #94a3b8;
  }

  .empty-activities p {
    margin: 0;
    font-size: 14px;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
  }

  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-card {
      padding: 20px;
    }

    .activity-section {
      padding: 20px;
    }
  }

  /* Loading State */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #1E69DD;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-container p {
    color: #64748b;
    font-size: 16px;
    margin: 0;
  }
</style>