<script lang="ts">
	import NavBar from '$layouts/NavBar.svelte';
	import Footer from '$layouts/Footer.svelte';
	import Button from '$components/common/Button.svelte';
	import TopHeader from '$layouts/TopHeader.svelte';
</script>

<svelte:head>
	<title>Teacher Guide | Create Language Courses on Asakiri</title>
	<meta
		name="description"
		content="A comprehensive guide for language teachers to create structured, effective courses on the Asakiri platform."
	/>
	<meta property="og:title" content="Teacher Guide | Asakiri" />
	<meta
		property="og:description"
		content="Learn how to build engaging language courses with grammar, vocabulary, and reading sections."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<TopHeader location="teachers" />
<NavBar />

<div class="teacher-guide">
	<header class="guide-header">
		<h1>Teacher Guide</h1>
		<p class="tagline">Create Effective Language Courses on Asakiri</p>
	</header>

	<section class="intro-section">
		<div class="container">
			<h2>Welcome, Language Teachers!</h2>
			<p>
				This guide will walk you through the process of creating effective language courses on
				Asakiri. Our platform enables you to build structured courses with grammar lessons,
				vocabulary practice, and reading exercises to help learners master a new language.
			</p>

			<div class="quick-actions">
				<Button href="/course/create" variant="primary" size="medium"
					>Create Your First Course</Button
				>
				<Button href="/teacher/courses" variant="secondary" size="medium"
					>Manage Your Courses</Button
				>
			</div>
		</div>
	</section>

	<section class="guide-overview">
		<div class="container">
			<h2>Course Creation Process</h2>

			<div class="process-steps">
				<div class="process-step">
					<div class="step-number">1</div>
					<h3>Design Your Course</h3>
					<p>Plan your course structure, learning objectives, and target audience</p>
				</div>

				<div class="process-step">
					<div class="step-number">2</div>
					<h3>Create Units</h3>
					<p>Organize your content into logical units with progressive difficulty</p>
				</div>

				<div class="process-step">
					<div class="step-number">3</div>
					<h3>Add Content Sections</h3>
					<p>Develop grammar, vocabulary, and reading sections for each unit</p>
				</div>

				<div class="process-step">
					<div class="step-number">4</div>
					<h3>Publish & Share</h3>
					<p>Review your course, publish it, and share with the community</p>
				</div>
			</div>
		</div>
	</section>

	<section class="detailed-guide">
		<div class="container">
			<h2>Step-by-Step Guide</h2>

			<div class="guide-section">
				<h3 id="course-setup">1. Setting Up Your Course</h3>

				<div class="step-card">
					<h4>Create a New Course</h4>
					<ol>
						<li>
							Navigate to <a href="/course/create">/course/create</a> or click "Create New Course" in
							the teacher dashboard
						</li>
						<li>
							Enter a descriptive course title (e.g., "Beginner Japanese for English Speakers")
						</li>
						<li>Click "Create Course" to proceed to the course editor</li>
					</ol>

					<div class="info-box">
						<h5>Pro Tip</h5>
						<p>
							Choose a clear, specific title that includes the language, level, and target audience
							when possible.
						</p>
					</div>
				</div>

				<div class="step-card">
					<h4>Configure Course Details</h4>
					<ol>
						<li>Add a detailed course description explaining what learners will achieve</li>
						<li>Select the language being taught and the instruction language</li>
						<li>Upload a course thumbnail image (recommended dimensions: 800×450px)</li>
						<li>Add a concise short description (max 150 characters) for course listings</li>
					</ol>

					<div class="screenshot">
						<img src="/images/guide/course-details.jpg" alt="Course details configuration screen" />
						<p class="caption">Course details configuration screen</p>
					</div>
				</div>
			</div>

			<div class="guide-section">
				<h3 id="units">2. Creating Course Units</h3>

				<div class="step-card">
					<h4>Add a New Unit</h4>
					<ol>
						<li>From the course editor, click "Add Unit"</li>
						<li>Enter a unit title (e.g., "Unit 1: Basic Greetings")</li>
						<li>Add a unit description detailing the learning objectives</li>
						<li>Save the unit to proceed to the unit editor</li>
					</ol>

					<div class="info-box">
						<h5>Unit Structure Best Practices</h5>
						<p>
							Structure units to build upon each other with a clear progression in difficulty. Aim
							for 3-7 units per course, each covering a coherent set of related concepts.
						</p>
					</div>
				</div>

				<div class="step-card">
					<h4>Organizing Multiple Units</h4>
					<ol>
						<li>Units are displayed in sequential order based on their numbering</li>
						<li>You can reorder units by dragging and dropping them in the course editor</li>
						<li>Consider including a summary or review unit at the end of your course</li>
					</ol>
				</div>
			</div>

			<div class="guide-section">
				<h3 id="grammar">3. Creating Grammar Sections</h3>

				<div class="step-card">
					<h4>Add a Grammar Section</h4>
					<ol>
						<li>From the unit editor, click "Create Section" and select "Grammar"</li>
						<li>Enter a title for your grammar section</li>
						<li>Use the rich text editor to create your grammar explanation</li>
						<li>Include examples and practice exercises</li>
					</ol>

					<div class="info-box">
						<h5>Effective Grammar Explanations</h5>
						<p>
							Keep explanations clear and concise. Use tables for conjugations or patterns, and
							always include multiple examples showing the grammar in context.
						</p>
					</div>

					<div class="example-box">
						<h5>Example Grammar Section Structure</h5>
						<ul>
							<li><strong>Main Explanation:</strong> Describe the grammar rule and its use</li>
							<li>
								<strong>Pattern/Formula:</strong> Show the structure clearly (e.g., Subject + は + Object
								+ が + Adjective)
							</li>
							<li><strong>Examples:</strong> 3-5 examples with translations</li>
							<li><strong>Exceptions:</strong> Note any exceptions to the rule</li>
							<li><strong>Practice Exercises:</strong> Simple exercises to apply the grammar</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="guide-section">
				<h3 id="vocabulary">4. Creating Vocabulary Sections</h3>

				<div class="step-card">
					<h4>Add a Vocabulary Section</h4>
					<ol>
						<li>From the unit editor, click "Create Section" and select "Vocabulary"</li>
						<li>Enter a title for your vocabulary section</li>
						<li>Add vocabulary items one by one, including:</li>
						<ul>
							<li>Term in the target language</li>
							<li>Definition in the instruction language</li>
							<li>Example sentence (recommended)</li>
							<li>Pronunciation guide (if applicable)</li>
						</ul>
						<li>Set difficulty levels for each vocabulary item to help with spaced repetition</li>
					</ol>

					<div class="info-box">
						<h5>Vocabulary Best Practices</h5>
						<p>
							Group vocabulary by theme (e.g., "Food," "Travel"). Aim for 10-15 words per section
							for optimal retention. Include natural example sentences.
						</p>
					</div>
				</div>

				<div class="step-card">
					<h4>Creating Effective Flashcards</h4>
					<ol>
						<li>Each vocabulary item automatically creates a flashcard for learners</li>
						<li>Provide clear, concise definitions</li>
						<li>Use high-quality example sentences that demonstrate context</li>
						<li>Add pronunciation guides using standardized systems when possible</li>
					</ol>

					<div class="example-box">
						<h5>Example Vocabulary Item</h5>
						<ul>
							<li><strong>Term:</strong> 食べる (taberu)</li>
							<li><strong>Definition:</strong> to eat</li>
							<li><strong>Example:</strong> 私は寿司を食べます。(Watashi wa sushi o tabemasu.)</li>
							<li><strong>Translation:</strong> I eat sushi.</li>
							<li><strong>Difficulty:</strong> 2 (Beginner)</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="guide-section">
				<h3 id="reading">5. Creating Reading Sections</h3>

				<div class="step-card">
					<h4>Add a Reading Section</h4>
					<ol>
						<li>From the unit editor, click "Create Section" and select "Reading"</li>
						<li>Enter a title for your reading section</li>
						<li>Add your reading text in the target language</li>
						<li>Provide a translation of the text</li>
						<li>Add comprehension questions to test understanding</li>
					</ol>

					<div class="info-box">
						<h5>Effective Reading Sections</h5>
						<p>
							Start with short, simple texts for beginners. Gradually increase length and
							complexity. Ensure that readings reinforce vocabulary and grammar from previous
							sections.
						</p>
					</div>
				</div>

				<div class="step-card">
					<h4>Adding Comprehension Questions</h4>
					<ol>
						<li>Create questions that test understanding of the text</li>
						<li>Include a mix of question types:</li>
						<ul>
							<li>Multiple choice questions</li>
							<li>True/false statements</li>
							<li>Open-ended questions</li>
						</ul>
						<li>Ensure questions progress from basic comprehension to deeper understanding</li>
					</ol>

					<div class="example-box">
						<h5>Example Reading Structure</h5>
						<ol>
							<li><strong>Introduction:</strong> Brief context for the reading</li>
							<li><strong>Text:</strong> The reading passage in the target language</li>
							<li><strong>Translation:</strong> Translation in the instruction language</li>
							<li><strong>Vocabulary Notes:</strong> Explanations of difficult words</li>
							<li>
								<strong>Comprehension Questions:</strong> 3-5 questions to check understanding
							</li>
						</ol>
					</div>
				</div>
			</div>

			<div class="guide-section">
				<h3 id="publishing">6. Reviewing and Publishing</h3>

				<div class="step-card">
					<h4>Review Your Course</h4>
					<ol>
						<li>Check each unit and section for completeness</li>
						<li>Ensure logical progression of difficulty</li>
						<li>Preview the course from a learner's perspective</li>
						<li>Fix any errors or inconsistencies</li>
					</ol>
				</div>

				<div class="step-card">
					<h4>Publish Your Course</h4>
					<ol>
						<li>From the course editor, click the "Publish" button</li>
						<li>Choose visibility settings:</li>
						<ul>
							<li><strong>Published:</strong> Available to all learners</li>
							<li><strong>Federation:</strong> Enable to share with federated instances</li>
						</ul>
						<li>Confirm publication when ready</li>
					</ol>

					<div class="info-box">
						<h5>Note on Federation</h5>
						<p>
							Enabling federation allows your course to be discovered by users on other Asakiri
							instances. This increases your course's reach while maintaining your control over the
							content.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="best-practices">
		<div class="container">
			<h2>Best Practices for Course Creators</h2>

			<div class="practices-grid">
				<div class="practice-card">
					<h3>Clear Learning Objectives</h3>
					<p>
						Define specific, measurable learning objectives for each unit and the overall course.
						Tell learners exactly what they'll be able to do upon completion.
					</p>
				</div>

				<div class="practice-card">
					<h3>Scaffolded Learning</h3>
					<p>
						Build complexity gradually by introducing new concepts that build on previously learned
						material. Reinforce vocabulary and grammar across different sections.
					</p>
				</div>

				<div class="practice-card">
					<h3>Cultural Context</h3>
					<p>
						Include cultural notes and authentic contexts to help learners understand how the
						language is used in real-world situations. This deepens understanding and engagement.
					</p>
				</div>

				<div class="practice-card">
					<h3>Regular Review</h3>
					<p>
						Incorporate review sections or exercises that revisit earlier material. Spaced
						repetition is key to long term retention of language skills.
					</p>
				</div>

				<div class="practice-card">
					<h3>Clear Instructions</h3>
					<p>
						Provide explicit, concise instructions for all exercises and activities. Learners should
						always understand what they're expected to do.
					</p>
				</div>

				<div class="practice-card">
					<h3>Diverse Content</h3>
					<p>
						Include a variety of content types and themes to keep learners engaged. Connect language
						learning to topics that are relevant and interesting.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="tools-resources">
		<div class="container">
			<h2>Tools & Resources</h2>

			<div class="resources-grid">
				<div class="resource-card">
					<h3>Rich Text Editor</h3>
					<p>
						Asakiri's built in editor supports formatting, tables, images and embedded audio to help
						you create engaging content. Use it to create clear, structured lessons.
					</p>
					<Button href="/docs/editor" variant="secondary" size="small" disabled={true}
						>Editor Guide</Button
					>
				</div>

				<div class="resource-card">
					<h3>Teacher Discord Community</h3>
					<p>
						Connect with other language teachers, share best practices and collaborate on course
						development through our teacher channel on discord.
					</p>
					<Button href="https://discord.gg/6VhDw5RXJ2" variant="secondary" size="small"
						>Join Community</Button
					>
				</div>
			</div>
		</div>
	</section>

	<section class="getting-started">
		<div class="container">
			<h2>Ready to Create Your Course?</h2>
			<p>
				Start building your language course today and share your expertise with learners worldwide.
				Remember, human-created courses with authentic examples and cultural context create the most
				effective learning experiences.
			</p>
			<Button href="/course/create" variant="primary" size="large">Create Your Course Now</Button>
		</div>
	</section>
</div>

<Footer />

<style>
	.teacher-guide {
		color: var(--color-neutral-900);
	}

	.guide-header {
		text-align: center;
		padding: var(--padding-xl) var(--padding-lg);
		background-color: var(--color-neutral-50);
		border-bottom: 1px solid var(--color-neutral-200);
	}

	.guide-header h1 {
		font-size: var(--text-4xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--gap-sm);
	}

	.tagline {
		font-size: var(--text-xl);
		color: var(--color-neutral-600);
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 var(--padding-lg);
	}

	section {
		padding: var(--padding-xl) 0;
	}

	section:nth-child(even) {
		background-color: var(--color-neutral-50);
	}

	h2 {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--gap-xl);
		text-align: center;
	}

	h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		margin-bottom: var(--gap-lg);
		padding-bottom: var(--gap-xs);
		border-bottom: 1px solid var(--color-neutral-200);
	}

	h4 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin-bottom: var(--gap-md);
	}

	h5 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin-bottom: var(--gap-sm);
	}

	p {
		margin-bottom: var(--gap-md);
		line-height: 1.6;
	}

	.intro-section p {
		font-size: var(--text-lg);
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
		text-align: center;
	}

	.quick-actions {
		display: flex;
		gap: var(--gap-md);
		justify-content: center;
		margin-top: var(--gap-xl);
	}

	.process-steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--gap-lg);
		margin-top: var(--gap-xl);
	}

	.process-step {
		text-align: center;
		position: relative;
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
	}

	.step-number {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: var(--color-primary-500);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		margin: 0 auto var(--gap-md);
	}

	.process-step h3 {
		border-bottom: none;
		padding-bottom: 0;
		margin-bottom: var(--gap-sm);
	}

	.process-step p {
		margin-bottom: 0;
	}

	.guide-section {
		margin-bottom: var(--gap-xl);
	}

	.step-card {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
		margin-bottom: var(--gap-lg);
	}

	.step-card ol,
	.step-card ul {
		margin: var(--gap-md) 0;
		padding-left: var(--gap-xl);
	}

	.step-card li {
		margin-bottom: var(--gap-sm);
		line-height: 1.5;
	}

	.info-box {
		background-color: var(--color-primary-50);
		border-left: 3px solid var(--color-primary-400);
		padding: var(--padding-md);
		margin: var(--gap-md) 0;
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	}

	.info-box h5 {
		color: var(--color-primary-700);
		margin-bottom: var(--gap-xs);
	}

	.info-box p {
		margin-bottom: 0;
	}

	.example-box {
		background-color: var(--color-neutral-50);
		border: 1px dashed var(--color-neutral-300);
		padding: var(--padding-md);
		margin: var(--gap-md) 0;
		border-radius: var(--radius-sm);
	}

	.screenshot {
		margin: var(--gap-md) 0;
		text-align: center;
	}

	.screenshot img {
		max-width: 100%;
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
	}

	.caption {
		font-size: var(--text-sm);
		color: var(--color-neutral-600);
		margin-top: var(--gap-xs);
	}

	.practices-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--gap-lg);
		margin-top: var(--gap-xl);
	}

	.practice-card {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
	}

	.practice-card h3 {
		font-size: var(--text-lg);
		border-bottom: none;
		padding-bottom: 0;
		margin-bottom: var(--gap-sm);
	}

	.practice-card p {
		margin-bottom: 0;
	}

	.resources-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--gap-lg);
		margin-top: var(--gap-xl);
	}

	.resource-card {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
		display: flex;
		flex-direction: column;
	}

	.resource-card h3 {
		font-size: var(--text-lg);
		border-bottom: none;
		padding-bottom: 0;
		margin-bottom: var(--gap-sm);
	}

	.resource-card p {
		margin-bottom: var(--gap-md);
		flex-grow: 1;
	}

	.getting-started {
		text-align: center;
		background-color: var(--color-primary-50);
	}

	.getting-started .container {
		max-width: 800px;
	}

	.getting-started p {
		margin-bottom: var(--gap-xl);
	}

	@media (max-width: 768px) {
		.quick-actions {
			flex-direction: column;
			align-items: center;
		}

		.process-steps {
			gap: var(--gap-xl);
		}
	}
</style>
