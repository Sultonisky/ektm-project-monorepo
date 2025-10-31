<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { authAPI } from '$lib/api';
  import logoEktm from '$lib/assets/images/logo/logo.png';
  import profileAdmin from '$lib/assets/images/profile/admin.jpeg';
  import { Icon, ICON_NAMES } from '$lib/components/icons';

  let sidebarOpen = $state(true);
  let user = authAPI.getCurrentUser() || { name: 'Admin User', email: 'admin@example.com', role: 'Administrator' };

  // Navigation items with dropdown support
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: ICON_NAMES.DASHBOARD
    },
    {
      id: 'users',
      label: 'Users',
      href: '/dashboard/users',
      icon: ICON_NAMES.USERS
    },
    {
      id: 'mahasiswa',
      label: 'Mahasiswa',
      href: '/dashboard/mahasiswa',
      icon: ICON_NAMES.MAHASISWA
    },
    {
      id: 'payments',
      label: 'Payments',
      href: '/dashboard/payment',
      icon: ICON_NAMES.PAYMENT
    },
    {
      id: 'biaya',
      label: 'Biaya',
      href: '/dashboard/biaya',
      icon: ICON_NAMES.BIAYA
    },
    {
      id: 'akademik',
      label: 'Akademik',
      icon: ICON_NAMES.ACADEMIC,
      isDropdown: true,
      children: [
        {
          id: 'matakuliah',
          label: 'Mata Kuliah',
          href: '/dashboard/matakuliah',
          icon: ICON_NAMES.COURSE
        },
        {
          id: 'campus',
          label: 'Campus',
          href: '/dashboard/campus',
          icon: ICON_NAMES.CAMPUS
        },
        {
          id: 'fakultas',
          label: 'Fakultas',
          href: '/dashboard/fakultas',
          icon: ICON_NAMES.FAKULTAS
        },
        {
          id: 'jurusan',
          label: 'Jurusan',
          href: '/dashboard/jurusan',
          icon: ICON_NAMES.JURUSAN
        }
      ]
    }
  ];

  let openDropdowns: Set<string> = $state(new Set());

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function toggleDropdown(dropdownId: string) {
    const newSet = new Set(openDropdowns);
    if (newSet.has(dropdownId)) {
      newSet.delete(dropdownId);
    } else {
      newSet.add(dropdownId);
    }
    openDropdowns = newSet;
  }

  function logout() {
    authAPI.logout();
    goto('/login');
  }

  function getCurrentPageId() {
    const path = $page.url.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path.startsWith('/dashboard/users')) return 'users';
    if (path.startsWith('/dashboard/mahasiswa')) return 'mahasiswa';
    if (path.startsWith('/dashboard/payment')) return 'payments';
    if (path.startsWith('/dashboard/biaya')) return 'biaya';
    if (path.startsWith('/dashboard/matakuliah')) return 'matakuliah';
    if (path.startsWith('/dashboard/campus')) return 'campus';
    if (path.startsWith('/dashboard/fakultas')) return 'fakultas';
    if (path.startsWith('/dashboard/jurusan')) return 'jurusan';
    return 'dashboard';
  }

  function isDropdownOpen(dropdownId: string) {
    return openDropdowns.has(dropdownId);
  }

  function isChildActive(item: any) {
    if (!item.isDropdown) return false;
    return item.children.some((child: any) => getCurrentPageId() === child.id);
  }

  function getPageTitle() {
    const currentPageId = getCurrentPageId();
    
    // Check if it's a dropdown child first
    for (const item of navItems) {
      if (item.isDropdown && item.children) {
        const child = item.children.find((child: any) => child.id === currentPageId);
        if (child) {
          return child.label;
        }
      }
    }
    
    // Fallback to regular nav item
    const navItem = navItems.find(item => item.id === currentPageId);
    return navItem?.label || 'Dashboard';
  }

  onMount(() => {
    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      goto('/login');
    }
    
    // Auto-open dropdown if current page is a child
    const currentPageId = getCurrentPageId();
    const newSet = new Set(openDropdowns);
    navItems.forEach(item => {
      if (item.isDropdown && item.children) {
        const hasActiveChild = item.children.some((child: any) => child.id === currentPageId);
        if (hasActiveChild) {
          newSet.add(item.id);
        }
      }
    });
    openDropdowns = newSet;
  });
</script>

<div class="dashboard-container">
  <!-- Sidebar -->
  <aside class="sidebar" class:collapsed={!sidebarOpen}>
    <div class="sidebar-header">
      <div class="logo">
        <img src={logoEktm} alt="E-KTM Logo" class="logo-image" />
        {#if sidebarOpen}
          <span class="logo-text">E-KTM Panel</span>
        {/if}
      </div>
    </div>

    <nav class="sidebar-nav">
      <ul>
        {#each navItems as item}
          <li>
            {#if item.isDropdown}
              <!-- Dropdown Menu Item -->
              <button 
                class="nav-item dropdown-toggle" 
                class:active={isChildActive(item)}
                onclick={() => toggleDropdown(item.id)}
              >
                <Icon name={item.icon} size={20} />
                {#if sidebarOpen}
                  <span>{item.label}</span>
                  <Icon 
                    name={isDropdownOpen(item.id) ? ICON_NAMES.CHEVRON_UP : ICON_NAMES.CHEVRON_DOWN} 
                    size={16}
                  />
                {/if}
              </button>
              
              <!-- Dropdown Content -->
              {#if isDropdownOpen(item.id)}
                {#if sidebarOpen}
                  <!-- Regular dropdown for expanded sidebar -->
                  <ul class="dropdown-menu">
                    {#each item.children as child}
                      <li>
                        <a 
                          href={child.href}
                          class="dropdown-item" 
                          class:active={getCurrentPageId() === child.id}
                        >
                          <Icon name={child.icon} size={16} />
                          <span>{child.label}</span>
                        </a>
                      </li>
                    {/each}
                  </ul>
                {:else}
                  <!-- Overlay dropdown for collapsed sidebar -->
                  <div class="dropdown-overlay">
                    <div class="dropdown-overlay-content">
                      <div class="dropdown-overlay-header">
                        <Icon name={item.icon} size={20} />
                        <span>{item.label}</span>
                        <button class="close-overlay" onclick={() => toggleDropdown(item.id)}>
                          <Icon name={ICON_NAMES.X} size={16} />
                        </button>
                      </div>
                      <ul class="dropdown-overlay-menu">
                        {#each item.children as child}
                          <li>
                            <a 
                              href={child.href}
                              class="dropdown-overlay-item" 
                              class:active={getCurrentPageId() === child.id}
                              onclick={() => toggleDropdown(item.id)}
                            >
                              <Icon name={child.icon} size={16} />
                              <span>{child.label}</span>
                            </a>
                          </li>
                        {/each}
                      </ul>
                    </div>
                  </div>
                {/if}
              {/if}
            {:else}
              <!-- Regular Menu Item -->
              <a 
                href={item.href}
                class="nav-item" 
                class:active={getCurrentPageId() === item.id}
              >
                <Icon name={item.icon} size={20} />
                {#if sidebarOpen}<span>{item.label}</span>{/if}
              </a>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="main-content" class:collapsed={!sidebarOpen}>
    <!-- Header -->
    <header class="header" class:collapsed={!sidebarOpen}>
      <div class="header-left">
        <button class="sidebar-toggle" onclick={toggleSidebar}>
          <Icon name={ICON_NAMES.MENU} size={20} />
        </button>
        <h1 class="page-title">
          {getPageTitle()}
        </h1>
      </div>
      
      <div class="header-right">
        <div class="user-menu">
          <div class="user-info">
            <div class="user-avatar">
              <img src={profileAdmin} alt={user.name} />
            </div>
            <div class="user-details">
              <span class="user-name">{user.name}</span>
              <span class="user-role">{user.role}</span>
            </div>
          </div>
          <button class="logout-btn" onclick={logout}>
            <Icon name={ICON_NAMES.LOGOUT_RED} size={18} />
          </button>
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <div class="content">
      <slot />
    </div>
  </main>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: #f8fafc;
    color: #334155;
  }

  .dashboard-container {
    display: flex;
    min-height: 100vh;
  }

  /* Sidebar */
  .sidebar {
    width: 280px;
    background: #ffffff;
    border-right: 1px solid #e2e8f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 4px 0 20px rgba(30, 105, 221, 0.05);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
    overflow-y: auto;
  }

  .sidebar.collapsed {
    width: 80px;
  }

  /* Adjust main content margin when sidebar is collapsed */
  .main-content.collapsed {
    margin-left: 80px;
  }

  /* Adjust header position when sidebar is collapsed */
  .header.collapsed {
    left: 80px;
  }

  .sidebar-header {
    padding: 24px 20px;
    border-bottom: 1px solid #e2e8f0;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }


  .logo-text {
    font-size: 18px;
    font-weight: 700;
    color: #1E69DD;
    white-space: nowrap;
  }

  .sidebar-nav {
    padding: 20px 0;
  }

  .sidebar-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 16px 20px;
    background: none;
    border: none;
    color: #64748b;
    font-size: 15px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    text-decoration: none;
  }

  .nav-item:hover {
    background: rgba(30, 105, 221, 0.08);
    color: #1E69DD;
  }

  .nav-item.active {
    background: linear-gradient(135deg, rgba(30, 105, 221, 0.1), rgba(87, 212, 212, 0.1));
    color: #1E69DD;
  }

  .nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #1E69DD, #57D4D4);
    border-radius: 0 2px 2px 0;
  }

  /* Dropdown Styles */
  .dropdown-toggle {
    justify-content: space-between;
    width: 100%;
  }

  .dropdown-toggle :global(svg:last-child) {
    transition: transform 0.2s ease;
    margin-left: auto;
    flex-shrink: 0;
  }

  .dropdown-menu {
    list-style: none;
    margin: 0;
    padding: 0;
    background: rgba(30, 105, 221, 0.02);
    border-left: 3px solid rgba(30, 105, 221, 0.1);
    margin-left: 20px;
    animation: slideDown 0.2s ease-out;
    overflow: hidden;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: calc(100% - 20px);
    padding: 12px 20px;
    background: none;
    border: none;
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    text-decoration: none;
    margin-left: 20px;
  }

  .dropdown-item:hover {
    background: rgba(30, 105, 221, 0.08);
    color: #1E69DD;
  }

  .dropdown-item.active {
    background: linear-gradient(135deg, rgba(30, 105, 221, 0.1), rgba(87, 212, 212, 0.1));
    color: #1E69DD;
  }

  .dropdown-item.active::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, #1E69DD, #57D4D4);
    border-radius: 0 2px 2px 0;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      max-height: 200px;
      transform: translateY(0);
    }
  }

  /* Dropdown Overlay for Collapsed Sidebar */
  .dropdown-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
  }

  .dropdown-overlay-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    min-width: 300px;
    max-width: 400px;
    animation: slideUp 0.2s ease-out;
  }

  .dropdown-overlay-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    border-bottom: 1px solid #e2e8f0;
    background: linear-gradient(135deg, rgba(30, 105, 221, 0.1), rgba(87, 212, 212, 0.1));
    border-radius: 12px 12px 0 0;
  }

  .dropdown-overlay-header span {
    font-weight: 600;
    color: #1E69DD;
    flex: 1;
  }

  .close-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    border-radius: 8px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }

  .close-overlay:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .dropdown-overlay-menu {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .dropdown-overlay-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 16px 20px;
    background: none;
    border: none;
    color: #64748b;
    font-size: 15px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    text-decoration: none;
  }

  .dropdown-overlay-item:hover {
    background: rgba(30, 105, 221, 0.08);
    color: #1E69DD;
  }

  .dropdown-overlay-item.active {
    background: linear-gradient(135deg, rgba(30, 105, 221, 0.1), rgba(87, 212, 212, 0.1));
    color: #1E69DD;
  }

  .dropdown-overlay-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #1E69DD, #57D4D4);
    border-radius: 0 2px 2px 0;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Main Content */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    margin-left: 280px;
    min-height: 100vh;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 32px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(30, 105, 221, 0.05);
    position: fixed;
    top: 0;
    left: 280px;
    right: 0;
    z-index: 20;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .sidebar-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    border-radius: 10px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }

  .sidebar-toggle:hover {
    background: rgba(30, 105, 221, 0.08);
    color: #1E69DD;
  }

  .page-title {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #1E69DD;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #1E69DD, #57D4D4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: 600;
    color: #334155;
    font-size: 14px;
  }

  .user-role {
    font-size: 12px;
    color: #64748b;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    border-radius: 8px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }

  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  /* Content */
  .content {
    flex: 1;
    padding: 32px;
    padding-top: 100px; /* Add space for fixed header */
    overflow-y: auto;
    min-height: calc(100vh - 100px);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .sidebar {
      transform: translateX(-100%);
    }

    .sidebar.collapsed {
      width: 280px;
      transform: translateX(0);
    }

    .main-content {
      margin-left: 0;
    }

    .main-content.collapsed {
      margin-left: 0;
    }

    .header {
      left: 0;
    }

    .header.collapsed {
      left: 0;
    }

    .content {
      padding: 20px;
      padding-top: 100px; /* Maintain space for fixed header on mobile */
    }

    .header {
      padding: 16px 20px;
    }

    /* Dropdown responsive */
    .dropdown-menu {
      margin-left: 15px;
    }

    .dropdown-item {
      margin-left: 15px;
      padding: 10px 15px;
    }
  }

  @media (max-width: 640px) {
    .user-details {
      display: none;
    }

    .dropdown-menu {
      margin-left: 10px;
    }

    .dropdown-item {
      margin-left: 10px;
      padding: 8px 10px;
      font-size: 13px;
    }

    .nav-item {
      padding: 12px 15px;
      font-size: 14px;
    }

    /* Mobile overlay adjustments */
    .dropdown-overlay-content {
      min-width: 280px;
      max-width: 90vw;
      margin: 20px;
    }

    .dropdown-overlay-header {
      padding: 16px;
    }

    .dropdown-overlay-item {
      padding: 12px 16px;
      font-size: 14px;
    }
  }

  /* Sidebar collapsed state */
  .sidebar.collapsed .dropdown-toggle :global(svg:last-child) {
    display: none;
  }

  /* Ensure dropdown toggle icon is visible when collapsed */
  .sidebar.collapsed .dropdown-toggle :global(svg:first-child) {
    display: block !important;
  }

  /* Ensure dropdown toggle button is properly styled when collapsed */
  .sidebar.collapsed .dropdown-toggle {
    justify-content: flex-start;
    align-items: center;
    padding: 16px 20px;
    gap: 12px;
  }

  /* Make sure the main icon is visible and aligned left like other icons */
  .sidebar.collapsed .dropdown-toggle > :global(svg:first-child) {
    display: block !important;
    margin: 0;
    width: 20px;
    height: 20px;
  }

  /* Additional fallback for icon visibility */
  .sidebar.collapsed .dropdown-toggle :global(svg) {
    display: block !important;
  }

  .sidebar.collapsed .dropdown-toggle :global(svg:not(:last-child)) {
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
  }

  .logo-image {
    width: 40px; /* Sesuaikan ukuran */
    height: 40px;
    object-fit: contain; /* Mempertahankan aspect ratio */
    border-radius: 8px; /* Optional: untuk rounded corners */
  }

  .logo-text {
    font-size: 24px;
    font-weight: 700;
    color: #1E69DD;
  }

  .user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
</style> 