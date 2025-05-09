<script lang="ts">
	import type { PageData } from './$types';
	import NavBar from '$layouts/NavBar.svelte';
	import Footer from '$layouts/Footer.svelte';
	import CourseCard from '$components/common/CourseCard.svelte';
	import TopHeader from '$layouts/TopHeader.svelte';
	import Button from '$components/common/Button.svelte';

	let { data } = $props<{ data: PageData }>();
	let { courses, federatedCourses } = data;
</script>

<svelte:head>
	<title>Early Access Language Courses | Asakiri - Join Our Growing Community</title>
	<meta
		name="description"
		content="Be among the first to join Asakiri's growing language learning community. Access curated courses from language experts or create your own course."
	/>
	<meta property="og:title" content="Early Access Language Courses | Asakiri" />
	<meta
		property="og:description"
		content="Join our growing community of language learners and teachers. Limited courses available now with more coming soon."
	/>
	<meta property="og:type" content="website" />
	<meta
		name="keywords"
		content="language learning, early access, create language course, community language learning"
	/>
</svelte:head>

<TopHeader />
<NavBar />

<div class="courses-page">
	<div class="hero">
		<div class="early-access-badge">Early Access</div>
		<h1>Join Our Growing Language Learning Community</h1>
		<p>We're just getting started with a select number of quality language courses</p>
		<p class="hero-description">
			Be among the first to experience our structured learning approach or help us grow by creating
			your own course
		</p>
	</div>

	<div class="platform-features">
		<div class="feature">
			<h3>Curated Quality</h3>
			<p>Each course is carefully created to ensure effective learning with structured lessons</p>
		</div>
		<div class="feature">
			<h3>Growing Collection</h3>
			<p>New language courses are being added regularly by our community of teachers</p>
		</div>
		<div class="feature">
			<h3>Early Creator Benefits</h3>
			<p>Create a course now and establish yourself as a founding instructor on our platform</p>
		</div>
	</div>

	<div class="courses-section">
		<div class="courses-header">
			<h2>Available Courses</h2>
			<Button href="/course/create" variant="primary" size="small">Create a Course</Button>
		</div>

		{#if courses.length > 0}
			<div class="courses-grid">
				{#each courses as course (course.id)}
					<CourseCard
						id={course.id}
						title={course.title}
						short_description={course.short_description || ''}
						thumbnail={course.thumbnail || ''}
						language_taught={course.language_taught || 'Unknown'}
						course_language={course.course_language || 'English'}
						author_name={course.author_name}
						author_avatar_url={course.author_avatar_url}
						author_subtitle={course.author_subtitle}
						enrolled_students={course.enrolled_students}
						showTotalEnrolled={true}
					/>
				{/each}
			</div>
		{:else}
			<div class="empty-courses">
				<p>No courses are available yet. Be the first to create a language course!</p>
				<Button href="/course/create" variant="primary" size="medium">Create Course</Button>
			</div>
		{/if}
	</div>
	{#if federatedCourses.length > 0}
		<div class="courses-section">
			<div class="courses-header">
				<h2>Federated Courses</h2>
			</div>
			<div class="courses-grid">
				{#each federatedCourses as federatedCourse (federatedCourse.id + '-' + federatedCourse.title)}
					<CourseCard
						id={federatedCourse.id}
						title={federatedCourse.title}
						short_description={federatedCourse.short_description || ''}
						thumbnail={federatedCourse.thumbnail || ''}
						language_taught={federatedCourse.language_taught || 'Unknown'}
						course_language={federatedCourse.course_language || 'English'}
						author_name={federatedCourse.author_name}
						author_avatar_url={federatedCourse.author_avatar_url}
						author_subtitle={federatedCourse.author_subtitle}
						enrolled_students={federatedCourse.enrolled_students}
						link={federatedCourse.federation_instance_url + '/course/' + federatedCourse.id}
						federation_instance_name={federatedCourse.federation_instance_name}
						showTotalEnrolled={false}
					/>
				{/each}
			</div>
		</div>
	{/if}

	<div class="coming-soon">
		<h2>Coming Soon</h2>
		<div class="coming-soon-grid">
			<div class="coming-soon-item">
				<div class="course-placeholder">
					<span>Japanese</span>
				</div>
				<p>Beginner Japanese with native speaker guidance</p>
			</div>
			<div class="coming-soon-item">
				<div class="course-placeholder">
					<span>Spanish</span>
				</div>
				<p>Conversational Spanish for travelers</p>
			</div>
			<div class="coming-soon-item">
				<div class="course-placeholder">
					<span>French</span>
				</div>
				<p>French for beginners with cultural context</p>
			</div>
		</div>
		<!-- <p class="coming-soon-note">
			These courses are currently in development. <a href="/notifications">Get notified</a> when new
			courses are available.
		</p> -->
	</div>

	<div class="community-section">
		<h2>Join Our Language Learning Community</h2>
		<p>
			Asakiri is building a community where language enthusiasts can learn and teach effectively.
			We're in the early stages and growing with each new member and course.
		</p>

		<div class="community-cards">
			<div class="community-card">
				<h3>For Learners</h3>
				<p>
					Get early access to quality language courses with a personalized learning experience. As
					an early member, you'll help shape the future of our platform.
				</p>
				<Button href="/auth/register" variant="secondary" size="small">Join as Learner</Button>
			</div>

			<div class="community-card highlight">
				<h3>For Teachers</h3>
				<p>
					Create your language course now and establish yourself as a founding instructor. Early
					course creators receive premium visibility and community support.
				</p>
				<Button href="/course/create" variant="primary" size="small">Create a Course</Button>
			</div>
		</div>
	</div>
</div>

<Footer />

<style>
    .courses-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--padding-lg);
    }

    .hero {
        text-align: center;
        margin-bottom: var(--gap-xl);
        padding: var(--padding-xl) 0;
        position: relative;
    }

    .early-access-badge {
        display: inline-block;
        background-color: var(--color-primary-100);
        color: var(--color-primary-700);
        padding: var(--padding-xs) var(--padding-sm);
        border-radius: var(--radius-sm);
        font-weight: var(--font-medium);
        font-size: var(--text-sm);
        margin-bottom: var(--gap-md);
    }

    .hero h1 {
        font-size: var(--text-4xl);
        font-weight: var(--font-bold);
        margin-bottom: var(--gap-sm);
        color: var(--color-neutral-900);
    }

    .hero p {
        color: var(--color-neutral-600);
        font-size: var(--text-lg);
        margin-bottom: var(--gap-xs);
    }

    .hero-description {
        max-width: 600px;
        margin: var(--gap-md) auto;
    }

    .platform-features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--gap-md);
        margin-bottom: var(--gap-xl);
    }

    .feature {
        padding: var(--padding-md);
        background-color: var(--color-neutral-50);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-neutral-200);
    }

    .feature h3 {
        font-size: var(--text-lg);
        font-weight: var(--font-semibold);
        margin-bottom: var(--gap-sm);
        color: var(--color-primary-500);
    }

    .feature p {
        color: var(--color-neutral-700);
        line-height: 1.5;
    }

    .courses-section {
        margin-bottom: var(--gap-xl);
    }

    .courses-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--gap-lg);
    }

    .courses-header h2 {
        font-size: var(--text-2xl);
        font-weight: var(--font-semibold);
        margin: 0;
    }

    .courses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--gap-lg);
    }

    .empty-courses {
        text-align: center;
        padding: var(--padding-xl);
        background-color: var(--color-neutral-50);
        border-radius: var(--radius-sm);
        border: 1px dashed var(--color-neutral-300);
    }

    .empty-courses p {
        margin-bottom: var(--gap-lg);
        color: var(--color-neutral-600);
    }

    .coming-soon {
        margin: var(--gap-xl) 0;
        text-align: center;
    }

    .coming-soon h2 {
        font-size: var(--text-2xl);
        margin-bottom: var(--gap-lg);
        position: relative;
        display: inline-block;
    }

    .coming-soon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--gap-lg);
        margin-bottom: var(--gap-md);
    }

    .coming-soon-item {
        text-align: center;
    }

    .course-placeholder {
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-neutral-100);
        border-radius: var(--radius-sm);
        margin-bottom: var(--gap-sm);
        border: 1px dashed var(--color-neutral-300);
    }

    .course-placeholder span {
        font-size: var(--text-2xl);
        color: var(--color-neutral-500);
        font-weight: var(--font-medium);
    }

    .coming-soon-item p {
        color: var(--color-neutral-700);
    }

    .coming-soon-note {
        font-size: var(--text-sm);
        color: var(--color-neutral-600);
        margin-top: var(--gap-md);
    }

    .community-section {
        background-color: var(--color-neutral-50);
        padding: var(--padding-lg);
        border-radius: var(--radius-sm);
        text-align: center;
        margin-top: var(--gap-xl);
    }

    .community-section h2 {
        font-size: var(--text-2xl);
        margin-bottom: var(--gap-md);
    }

    .community-section > p {
        max-width: 800px;
        margin: 0 auto var(--gap-lg);
        line-height: 1.6;
        color: var(--color-neutral-700);
    }

    .community-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--gap-lg);
        margin-top: var(--gap-lg);
    }

    .community-card {
        padding: var(--padding-md);
        background-color: white;
        border-radius: var(--radius-sm);
        text-align: left;
    }

    .community-card.highlight {
        border: 1px solid var(--color-primary-200);
        background-color: var(--color-primary-50);
    }

    .community-card h3 {
        margin-bottom: var(--gap-sm);
        font-size: var(--text-lg);
        font-weight: var(--font-semibold);
    }

    .community-card p {
        margin-bottom: var(--gap-md);
        line-height: 1.5;
    }

    @media (max-width: 768px) {
        .courses-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--gap-md);
        }

        .community-cards {
            grid-template-columns: 1fr;
        }
    }
</style>
