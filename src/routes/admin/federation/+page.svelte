<script lang="ts">
	import Button from '$components/common/Button.svelte';
	import InputBox from '$components/common/InputBox.svelte';
	import NavBarSecondary from '$layouts/NavBarSecondary.svelte';
	import { Trash, Power, Plus } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
	let { instances } = data;

	let showAddForm = $state(false);
	let newInstance = $state({
		name: '',
		url: ''
	});

	function toggleAddForm() {
		showAddForm = !showAddForm;
	}

	async function addInstance() {
		const response = await fetch('?/addInstance', {
			method: 'POST',
			body: JSON.stringify(newInstance),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			// Reset form
			newInstance = { name: '', url: '' };
			showAddForm = false;
			// Reload data
			location.reload();
		} else {
			const data = await response.json();
			alert(`Error: ${data.message}`);
		}
	}

	async function toggleInstance(id: string, currentStatus: boolean) {
		const response = await fetch('?/toggleInstance', {
			method: 'POST',
			body: JSON.stringify({ id, status: !currentStatus })
		});

		if (response.ok) {
			// Update instance status locally
			instances = instances.map((instance) =>
				instance.id === id ? { ...instance, is_active: !currentStatus } : instance
			);
		}
	}

	async function removeInstance(id: string) {
		if (!confirm('Are you sure you want to remove this instance?')) {
			return;
		}

		const response = await fetch('?/removeInstance', {
			method: 'POST',
			body: JSON.stringify({ id })
		});

		if (response.ok) {
			// Remove instance from local list
			instances = instances.filter((instance) => instance.id !== id);
		}
	}

	async function testConnection(url: string) {
		try {
			const response = await fetch('?/testConnection', {
				method: 'POST',
				body: JSON.stringify({ url })
			});

			const result = await response.json();
			alert(result.message);
		} catch (err) {
			alert('Connection test failed');
		}
	}
</script>

<NavBarSecondary href="/"/>

<div class="admin-container">
	<div class="admin-header">
		<h1>Course Federation</h1>
		<Button onclick={toggleAddForm} variant="primary" size="small">
			<Plus size={16} />
			Add Instance
		</Button>
	</div>

	{#if showAddForm}
		<div class="add-instance-form">
			<h2>Add New Instance</h2>

			<div class="form-group">
				<InputBox
					type="text"
					label="Instance Name"
					placeholder="e.g., Main Campus"
					bind:value={newInstance.name}
					required={true}
				/>
			</div>

			<div class="form-group">
				<InputBox
					type="text"
					label="Instance URL"
					placeholder="https://example.com"
					bind:value={newInstance.url}
					required={true}
				/>
				<p class="hint">The full URL of the instance, including https://</p>
			</div>

			<div class="form-actions">
				<Button onclick={addInstance} variant="primary" size="small">Add Instance</Button>
				<Button onclick={toggleAddForm} variant="secondary" size="small">Cancel</Button>
			</div>
		</div>
	{/if}

	<div class="instances-table">
		<h2>Connected Instances</h2>

		{#if instances.length === 0}
			<div class="empty-state">
				<p>
					No federated instances added yet. Add your first instance to discover courses from other
					instances.
				</p>
			</div>
		{:else}
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>URL</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each instances as instance}
						<tr class={instance.is_active ? '' : 'inactive'}>
							<td>{instance.name}</td>
							<td>{instance.url}</td>
							<td>
								<span class={`status-badge ${instance.is_active ? 'active' : 'inactive'}`}>
									{instance.is_active ? 'Active' : 'Inactive'}
								</span>
							</td>
							<td class="actions">
								<button
									class="action-button"
									title={instance.is_active ? 'Disable' : 'Enable'}
									onclick={() => toggleInstance(instance.id, instance.is_active)}
								>
									<Power size={16} />
								</button>
								<button
									class="action-button test"
									title="Test Connection"
									onclick={() => testConnection(instance.url)}
								>
									Test
								</button>
								<button
									class="action-button delete"
									title="Remove"
									onclick={() => removeInstance(instance.id)}
								>
									<Trash size={16} />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<div class="info-section">
		<h3>About Course Federation</h3>
		<p>
			Course federation allows your instance to discover and display courses from other Asakiri
			instances.
		</p>
		<p>Users will need to visit the original instance to enroll in and take these courses.</p>
	</div>
</div>

<style lang="scss">
	.admin-container {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--padding-lg);
	}

	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--gap-xl);

		h1 {
			margin: 0;
			font-size: var(--text-3xl);
			font-weight: var(--font-bold);
		}
	}

	.add-instance-form {
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
		margin-bottom: var(--gap-xl);
		border: 1px solid var(--color-neutral-200);

		h2 {
			margin-top: 0;
			margin-bottom: var(--gap-lg);
			font-size: var(--text-xl);
		}
	}

	.form-group {
		margin-bottom: var(--gap-md);
	}

	.hint {
		font-size: var(--text-sm);
		color: var(--color-neutral-600);
		margin-top: var(--gap-xs);
	}

	.form-actions {
		display: flex;
		gap: var(--gap-md);
		margin-top: var(--gap-lg);
	}

	.instances-table {
		background-color: var(--color-neutral-0);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
		border: 1px solid var(--color-neutral-200);
		margin-bottom: var(--gap-xl);

		h2 {
			margin-top: 0;
			margin-bottom: var(--gap-lg);
			font-size: var(--text-xl);
		}

		table {
			width: 100%;
			border-collapse: collapse;
		}

		th,
		td {
			padding: var(--padding-sm);
			text-align: left;
			border-bottom: 1px solid var(--color-neutral-200);
		}

		th {
			font-weight: var(--font-semibold);
			color: var(--color-neutral-700);
		}

		tr.inactive {
			color: var(--color-neutral-500);
			background-color: var(--color-neutral-50);
		}

		.status-badge {
			display: inline-block;
			padding: 2px 8px;
			border-radius: 12px;
			font-size: var(--text-xs);
			font-weight: var(--font-medium);

			&.active {
				background-color: var(--color-primary-100);
				color: var(--color-primary-700);
			}

			&.inactive {
				background-color: var(--color-neutral-200);
				color: var(--color-neutral-700);
			}
		}

		.actions {
			display: flex;
			gap: var(--gap-xs);
		}

		.action-button {
			background: none;
			border: none;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 28px;
			height: 28px;
			border-radius: var(--radius-xs);
			color: var(--color-neutral-600);

			&:hover {
				background-color: var(--color-neutral-100);
			}

			&.test {
				font-size: var(--text-xs);
				font-weight: var(--font-medium);
				width: auto;
				padding: 0 var(--padding-xs);
			}

			&.delete:hover {
				background-color: rgba(229, 57, 53, 0.1);
				color: #e53935;
			}
		}
	}

	.empty-state {
		padding: var(--padding-lg);
		text-align: center;
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		color: var(--color-neutral-600);
	}

	.info-section {
		background-color: var(--color-primary-50);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);

		h3 {
			margin-top: 0;
			color: var(--color-primary-700);
		}

		p {
			color: var(--color-primary-900);
			margin-bottom: var(--gap-md);

			&:last-child {
				margin-bottom: 0;
			}
		}
	}
</style>
