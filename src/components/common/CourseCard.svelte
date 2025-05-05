<script lang="ts">
	interface CourseCard {
		id: string;
		title: string;
		author_name: string | null;
		author_subtitle: string | null;
		author_avatar_url: string | null;
		short_description: string;
		course_language: string;
		language_taught: string;
		thumbnail: string;
		enrolled_students?: number;
		isPublished?: boolean;
	}

	interface CourseCardProps extends CourseCard {
		link?: string;
		showTotalEnrolled?: boolean;
		showAuthor?: boolean; // Added showAuthor prop
	}

	let {
		id,
		title,
		author_name,
		author_subtitle,
		author_avatar_url,
		short_description,
		course_language,
		language_taught,
		thumbnail,
		enrolled_students,
		isPublished,
		link,
		showTotalEnrolled = true,
		showAuthor = true // Default to showing author info
	}: CourseCardProps = $props();

	const finalLink = link || `/course/${id}`;
</script>

<a href={finalLink} class="card-link">
	<div class="card">
		<!-- Thumbnail -->
		<div class="thumbnail-container">
			<img src={thumbnail} alt={title} class="card-thumbnail" />
			{#if isPublished !== undefined}
				<div class="status-badge {isPublished ? 'published' : 'draft'}">
					{isPublished ? 'Published' : 'Draft'}
				</div>
			{/if}
		</div>

		<!-- Author Header - only shown if showAuthor is true -->
		{#if showAuthor}
			<div class="card-header">
				{#if author_avatar_url}
					<img class="card-avatar" src={author_avatar_url} alt={`${author_name}`} />
				{:else}
					<div class="card-avatar-fallback">
						{author_name?.charAt(0) || '?'}
					</div>
				{/if}

				<div class="card-teacher-details">
					<h2 class="card-teacher-name">{author_name}</h2>
					<p class="card-teacher-subtitle">{author_subtitle}</p>
				</div>
			</div>
		{/if}

		<!-- Content -->
		<div class="card-content">
			<h2 class="card-content-course-title">{title}</h2>
			<div class="card-content-course-description">
				{short_description}
			</div>

			<div class="card-content-language">
				<p class="card-content-from-text">Language Taught -</p>
				<p class="card-content-language-taught">{language_taught}</p>
			</div>

			<div class="card-content-language">
				<p class="card-content-from-text">Taught in -</p>
				<p class="card-content-from-language">{course_language}</p>
			</div>
		</div>

		<!-- Footer (conditional) -->
		{#if showTotalEnrolled && enrolled_students !== undefined}
			<div class="card-footer">
				<div class="card-footer-left">
					<div class="card-course-cost">
						<!-- Simple user icon -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
						<div class="card-course-cost-text">
							<span class="card-course-cost-number">{enrolled_students}</span> students enrolled
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</a>

<style lang="scss">
	.card-link {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.card {
		background-color: var(--color-neutral-0);
		overflow: hidden;
		transition: all 0.2s ease-in-out;
		border: 1px solid var(--color-neutral-100);
		display: flex;
		flex-direction: column;
		padding: var(--padding-md);
		border-radius: var(--radius-sm);

		&:hover {
			transform: translateY(-4px);
		}

		.thumbnail-container {
			position: relative;
			width: 100%;
			height: 180px;
		}

		.card-thumbnail {
			width: 100%;
			height: 100%;
			object-fit: cover;
			border-radius: var(--radius-sm);
		}

		.status-badge {
			position: absolute;
			top: 10px;
			right: 10px;
			padding: 4px 8px;
			border-radius: 4px;
			font-size: var(--text-xs);
			font-weight: var(--font-medium);
			text-transform: uppercase;

			&.published {
				background-color: var(--color-primary-200);
				color: var(--color-primary-700);
			}

			&.draft {
				background-color: var(--color-neutral-200);
				color: var(--color-neutral-700);
			}
		}

		.card-header {
			display: flex;
			align-items: center;
			padding-top: var(--padding-md);
			gap: var(--gap-sm);

			.card-avatar {
				width: 42px;
				height: 42px;
				border-radius: 50%;
				object-fit: cover;
			}

			.card-avatar-fallback {
				width: 42px;
				height: 42px;
				border-radius: 50%;
				background-color: var(--color-primary-300);
				color: var(--color-neutral-0);
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: var(--font-semibold);
			}

			.card-teacher-details {
				display: flex;
				flex-direction: column;

				.card-teacher-name {
					margin: 0;
					font-size: var(--text-base);
					font-weight: var(--font-semibold);
					color: var(--color-neutral-990);
				}

				.card-teacher-subtitle {
					margin: 0;
					font-size: var(--text-sm);
					color: var(--color-neutral-600);
				}
			}
		}

		.card-content {
			padding-top: var(--padding-md);
			padding-bottom: var(--padding-md);
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			gap: var(--gap-sm);

			.card-content-course-title {
				margin: 0;
				font-size: 16px;
				font-style: normal;
				font-weight: 600;
				line-height: 1.5;
				color: var(--color-neutral-990);
			}

			.card-content-course-description {
				color: var(--color-neutral-600);
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: 145%;
				margin-bottom: var(--gap-md);
			}

			.card-content-language {
				display: flex;
				align-items: center;
				gap: var(--gap-xxs);
				font-size: var(--text-sm);

				.card-content-from-text {
					color: var(--color-neutral-500);
					margin: 0;
				}

				.card-content-language-taught,
				.card-content-from-language {
					color: var(--color-neutral-700);
					margin: 0;
					font-weight: var(--font-medium);
				}
			}
		}

		.card-footer {
			border-top: 1px solid var(--color-neutral-200);
			padding-top: var(--padding-md);

			.card-footer-left {
				display: flex;
				align-items: center;
			}

			.card-course-cost {
				display: flex;
				align-items: center;
				gap: var(--gap-xs);
				color: var(--color-neutral-600);

				.card-course-cost-text {
					font-size: var(--text-sm);
					color: var(--color-neutral-600);

					.card-course-cost-number {
						font-weight: var(--font-medium);
						color: var(--color-neutral-700);
					}
				}
			}
		}
	}
</style>
