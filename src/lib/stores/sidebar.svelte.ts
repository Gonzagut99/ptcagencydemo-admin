class SidebarStore {
	private state = $state({
		isCollapsed: false
	});

	get isCollapsed() {
		return this.state.isCollapsed;
	}

	toggle() {
		this.state.isCollapsed = !this.state.isCollapsed;
		this.persist();
	}

	collapse() {
		this.state.isCollapsed = true;
		this.persist();
	}

	expand() {
		this.state.isCollapsed = false;
		this.persist();
	}

	initialize() {
		if (typeof localStorage !== 'undefined') {
			const saved = localStorage.getItem('sidebar_collapsed');
			if (saved !== null) {
				this.state.isCollapsed = saved === 'true';
			}
		}
	}

	private persist() {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('sidebar_collapsed', String(this.state.isCollapsed));
		}
	}
}

export const sidebarStore = new SidebarStore();
