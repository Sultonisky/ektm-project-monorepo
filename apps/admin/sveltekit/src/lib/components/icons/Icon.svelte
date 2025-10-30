<script lang="ts">
  export let name: string;
  export let size: number = 16;
  export let color: string = 'currentColor';
  export let strokeWidth: number = 2;

  // Icon definitions
  const icons: Record<string, string> = {
    // Navigation icons - More specific and recognizable
    'dashboard': '<rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>',
    
    'users': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2"/>',
    
    'user': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>',
    
    'mahasiswa': '<path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" stroke-width="2"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="8" r="2" stroke="currentColor" stroke-width="2"/>',
    
    'payment': '<rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" stroke-width="2"/><path d="M6 7h2" stroke="currentColor" stroke-width="2"/><path d="M16 7h2" stroke="currentColor" stroke-width="2"/>',

    'biaya': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="1" fill="currentColor"/><path d="M8 8h8" stroke="currentColor" stroke-width="2"/><path d="M8 16h8" stroke="currentColor" stroke-width="2"/>',
    
    'academic': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="2"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="8" r="2" stroke="currentColor" stroke-width="2"/><path d="M12 10v4" stroke="currentColor" stroke-width="2"/><path d="M8 12h8" stroke="currentColor" stroke-width="2"/>',

    'course': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="2"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="2"/><path d="M8 6h8" stroke="currentColor" stroke-width="2"/><path d="M8 10h8" stroke="currentColor" stroke-width="2"/><path d="M8 14h6" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/>',
    
    'campus': '<path d="M3 21h18" stroke="currentColor" stroke-width="2"/><path d="M5 21V7l8-4v18" stroke="currentColor" stroke-width="2"/><path d="M19 21V11l-6-4" stroke="currentColor" stroke-width="2"/><rect x="8" y="9" width="2" height="2" fill="currentColor"/><rect x="8" y="13" width="2" height="2" fill="currentColor"/><rect x="8" y="17" width="2" height="2" fill="currentColor"/><rect x="12" y="9" width="2" height="2" fill="currentColor"/><rect x="12" y="13" width="2" height="2" fill="currentColor"/><rect x="12" y="17" width="2" height="2" fill="currentColor"/>',

    'fakultas': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="2"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="2"/><path d="M8 8h8" stroke="currentColor" stroke-width="2"/><path d="M8 12h8" stroke="currentColor" stroke-width="2"/><path d="M8 16h5" stroke="currentColor" stroke-width="2"/>',
    
    'jurusan': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="2"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="8" r="1.5" stroke="currentColor" stroke-width="2"/><path d="M12 10v3" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="15" r="1" stroke="currentColor" stroke-width="2"/>',

    // Action icons
    'menu': '<line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2"/>',
    
    'plus': '<line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>',
    
    'edit': '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>',
    
    'delete': '<polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/><path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke="currentColor" stroke-width="2"/>',
    
    'search': '<circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2"/>',
    
    'eye': '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>',
    
    'eye-off': '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>',
    
    'logout': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2"/><polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2"/>',

    'logout-red': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#dc2626" stroke-width="2"/><polyline points="16,17 21,12 16,7" stroke="#dc2626" stroke-width="2"/><line x1="21" y1="12" x2="9" y2="12" stroke="#dc2626" stroke-width="2"/>',
    
    'warning': '<path d="M12 2L2 20h20L12 2z" stroke="currentColor" stroke-width="2" fill="currentColor"/><path d="M12 8v4" stroke="white" stroke-width="2"/><circle cx="12" cy="16" r="1" fill="white"/>',
    
    'check': '<polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>',
    
    'x': '<line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>',
    
    'chevron-left': '<polyline points="15,18 9,12 15,6" stroke="currentColor" stroke-width="2"/>',
    
    'chevron-right': '<polyline points="9,18 15,12 9,6" stroke="currentColor" stroke-width="2"/>',
    
    'chevron-up': '<polyline points="18,15 12,9 6,15" stroke="currentColor" stroke-width="2"/>',
    
    'chevron-down': '<polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2"/>',
    
    'calendar': '<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>',
    
    'clock': '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2"/>',
    
    'mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/><polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>',
    
    'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2"/>',
    
    // Additional specific icons
    'graduation-cap': '<path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" stroke-width="2"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" stroke-width="2"/>',
    
    'building': '<path d="M3 21h18" stroke="currentColor" stroke-width="2"/><path d="M5 21V7l8-4v18" stroke="currentColor" stroke-width="2"/><path d="M19 21V11l-6-4" stroke="currentColor" stroke-width="2"/><path d="M9 9h.01" stroke="currentColor" stroke-width="2"/><path d="M9 12h.01" stroke="currentColor" stroke-width="2"/><path d="M9 15h.01" stroke="currentColor" stroke-width="2"/><path d="M9 18h.01" stroke="currentColor" stroke-width="2"/>',
    
    'credit-card': '<rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" stroke-width="2"/><path d="M6 7h2" stroke="currentColor" stroke-width="2"/><path d="M16 7h2" stroke="currentColor" stroke-width="2"/>',
    
    'book': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" stroke-width="2"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="2"/>',
    
    'settings': '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" stroke-width="2"/>',
    
    'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/><polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>',
    
    'upload': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/><polyline points="17,8 12,3 7,8" stroke="currentColor" stroke-width="2"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2"/>',
    
    'filter': '<polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" stroke-width="2"/>',
    
    'sort': '<path d="M3 6h18" stroke="currentColor" stroke-width="2"/><path d="M7 12h10" stroke="currentColor" stroke-width="2"/><path d="M10 18h4" stroke="currentColor" stroke-width="2"/>',
    
    'refresh': '<polyline points="23,4 23,10 17,10" stroke="currentColor" stroke-width="2"/><polyline points="1,20 1,14 7,14" stroke="currentColor" stroke-width="2"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2"/>',
    
    'info': '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 16v-4" stroke="currentColor" stroke-width="2"/><path d="M12 8h.01" stroke="currentColor" stroke-width="2"/>'
  };

  $: iconPath = icons[name] || icons['x']; // fallback to 'x' if icon not found
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none"
  style="color: {color}"
>
  {@html iconPath}
</svg>
