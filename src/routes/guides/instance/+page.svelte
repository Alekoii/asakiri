<script lang="ts">
	import NavBar from '$layouts/NavBar.svelte';
	import Footer from '$layouts/Footer.svelte';
	import Button from '$components/common/Button.svelte';
	import TopHeader from '$layouts/TopHeader.svelte';
</script>

<svelte:head>
	<title>Asakiri Deployment Guide | Quick Setup with Supabase and Vercel</title>
	<meta
		name="description"
		content="Learn how to set up your Asakiri language learning platform by configuring Supabase database and deploying to Vercel or Netlify."
	/>
	<meta property="og:title" content="Asakiri Deployment Guide" />
	<meta
		property="og:description"
		content="Step-by-step instructions for deploying Asakiri with Supabase and cloud platforms."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<TopHeader />
<NavBar />

<div class="deployment-guide">
	<header class="guide-header">
		<h1>Deployment Guide</h1>
		<p class="tagline">Set Up and Deploy Your Asakiri Instance</p>
	</header>

	<section class="intro-section">
		<div class="container">
			<h2>Getting Started</h2>
			<p>
				Asakiri is a modern language learning platform that combines a SvelteKit frontend with
				Supabase backend services. This guide will walk you through setting up your own instance,
				starting with database configuration and then deploying the frontend to your preferred cloud
				provider.
			</p>

			<div class="requirements-box">
				<h3>Requirements</h3>
				<ul>
					<li><strong>GitHub Account:</strong> To store and deploy your code</li>
					<li><strong>Supabase Account:</strong> For database, storage, and authentication</li>
					<li><strong>Vercel or Netlify Account:</strong> For frontend hosting</li>
					<li><strong>Node.js & npm:</strong> For local development</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="database-setup">
		<div class="container">
			<h2>1. Supabase Database Setup</h2>

			<div class="step-card">
				<h3>Create a Supabase Project</h3>
				<ol>
					<li>
						Go to <a href="https://supabase.com" target="_blank" rel="noopener">Supabase</a> and sign
						in
					</li>
					<li>Create a new project by clicking "New Project"</li>
					<li>Give your project a name and set a secure database password</li>
					<li>Select a region closest to your users</li>
					<li>Wait for your project to be created (this may take a few minutes)</li>
				</ol>
			</div>

			<div class="step-card">
				<h3>Set Up Supabase CLI</h3>
				<p>The Supabase CLI is the easiest way to apply database migrations:</p>

				<div class="code-block">
					<pre><code>npm install -g supabase</code></pre>
				</div>

				<p>Once installed, log in to your Supabase account:</p>

				<div class="code-block">
					<pre><code>supabase login</code></pre>
				</div>
			</div>

			<div class="step-card">
				<h3>Initialize Database Migrations</h3>
				<p>In your Asakiri project directory:</p>

				<ol>
					<li>
						<strong>Link your project:</strong>
						<div class="code-block">
							<pre><code
									>supabase init
supabase link --project-ref YOUR_PROJECT_ID</code
								></pre>
						</div>
						<p class="hint">
							You can find your project ID in the Supabase dashboard URL or in project settings
						</p>
					</li>
					<li>
						<strong>Apply migrations:</strong>
						<div class="code-block">
							<pre><code>supabase db push</code></pre>
						</div>
					</li>
				</ol>

				<div class="info-box">
					<h4>What's Happening?</h4>
					<p>
						This command applies all database migrations from your project's
						<code>supabase/migrations</code> directory. It sets up all necessary tables, functions, triggers,
						and RLS policies for Asakiri to function properly.
					</p>
				</div>
			</div>

			<div class="step-card">
				<h3>Configure Authentication</h3>
				<ol>
					<li>In your Supabase dashboard, go to Authentication → Providers</li>
					<li>Ensure Email provider is enabled</li>
					<li>
						Optionally, set up OAuth providers (Google, GitHub, etc.) if you want to support social
						logins
					</li>
					<li>Go to Authentication → URL Configuration</li>
					<li>
						Leave the Site URL field blank for now (we'll return to this after deploying the
						frontend)
					</li>
				</ol>
			</div>

			<div class="step-card">
				<h3>Get Supabase Credentials</h3>
				<p>
					You'll need your Supabase URL and anonymous key to connect your frontend. From your
					Supabase dashboard:
				</p>
				<ol>
					<li>Go to Project Settings → API</li>
					<li>Copy the "Project URL" and "anon public" key</li>
					<li>Keep these values handy for the frontend deployment step</li>
				</ol>
			</div>
		</div>
	</section>

	<section class="options-overview">
		<div class="container">
			<h2>2. Frontend Deployment Options</h2>

			<div class="options-grid">
				<div class="option-card">
					<div class="option-logo">
						<img src="/images/vercel.svg" alt="Vercel Logo" />
					</div>
					<h3>Vercel</h3>
					<ul class="benefits-list">
						<li>Native SvelteKit support</li>
						<li>Simplified environment variable management</li>
						<li>Automatic preview deployments</li>
						<li>Edge function support</li>
					</ul>
				</div>

				<div class="option-card">
					<div class="option-logo">
						<img src="/images/netlify-logo.svg" alt="Netlify Logo" />
					</div>
					<h3>Netlify</h3>
					<ul class="benefits-list">
						<li>Simple GitHub integration</li>
						<li>Built-in form handling</li>
						<li>Easy rollbacks</li>
						<li>Serverless function support</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section class="vercel-guide">
		<div class="container">
			<h2>3a. Deploying to Vercel</h2>

			<div class="step-card">
				<h3>Prepare Your Project</h3>
				<p>
					First, ensure your project is ready for Vercel deployment by installing the Vercel
					adapter:
				</p>

				<div class="code-block">
					<pre><code>npm install @sveltejs/adapter-vercel</code></pre>
				</div>

				<p>Update your <code>svelte.config.js</code> file:</p>

				<!-- <div class="code-block">
					<pre><code>import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
};

export default config;</code></pre>
				</div> -->
			</div>

			<div class="step-card">
				<h3>Configure Environment Variables</h3>
				<p>
					Create a <code>.env</code> file in your project root with your Supabase credentials:
				</p>

				<div class="code-block">
					<pre><code
							>PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PUBLIC_FRONTEND_URL=http://localhost:5173 # Will update after deployment</code
						></pre>
				</div>

				<p>
					Make sure to add <code>.env</code> to your <code>.gitignore</code> file to keep your credentials
					secure.
				</p>
			</div>

			<div class="step-card">
				<h3>Push to GitHub</h3>
				<p>Commit your changes and push your code to GitHub:</p>

				<div class="code-block">
					<pre><code
							>git add .
git commit -m "Prepare for deployment"
git push</code
						></pre>
				</div>
			</div>

			<div class="step-card">
				<h3>Deploy on Vercel</h3>
				<ol>
					<li>
						Go to <a href="https://vercel.com" target="_blank" rel="noopener">Vercel</a> and sign in
						with GitHub
					</li>
					<li>Click on "Add New" → "Project"</li>
					<li>Find and select your Asakiri repository</li>
					<li>
						In the Configure Project section, add these environment variables:
						<div class="env-vars">
							<div class="env-var">
								<span class="env-name">PUBLIC_SUPABASE_URL</span>
								<span class="env-value">https://your-project-id.supabase.co</span>
							</div>
							<div class="env-var">
								<span class="env-name">PUBLIC_SUPABASE_ANON_KEY</span>
								<span class="env-value">your-supabase-anon-key</span>
							</div>
							<div class="env-var">
								<span class="env-name">PUBLIC_FRONTEND_URL</span>
								<span class="env-value">You'll add this after deployment</span>
							</div>
						</div>
					</li>
					<li>Click "Deploy"</li>
				</ol>
			</div>

			<div class="step-card">
				<h3>Update Environment Variables</h3>
				<p>
					After deployment, you'll get a URL for your site (e.g., <code
						>https://your-app.vercel.app</code
					>). Update the <code>PUBLIC_FRONTEND_URL</code> in your Vercel project settings with this URL.
				</p>
			</div>
		</div>
	</section>

	<section class="netlify-guide">
		<div class="container">
			<h2>3b. Deploying to Netlify</h2>

			<div class="step-card">
				<h3>Prepare Your Project</h3>
				<p>Install the Netlify adapter for SvelteKit:</p>

				<div class="code-block">
					<pre><code>npm install @sveltejs/adapter-netlify</code></pre>
				</div>

				<p>Update your <code>svelte.config.js</code> file:</p>

				<!-- <div class="code-block">
					<pre><code>import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
};

export default config;</code></pre>
				</div> -->
			</div>

			<div class="step-card">
				<h3>Add netlify.toml Configuration</h3>
				<p>
					Create a <code>netlify.toml</code> file in the root of your project:
				</p>

				<div class="code-block">
					<pre><code
							>[build]
  command = "npm run build"
  publish = "build"

[dev]
  command = "npm run dev"
  port = 5173

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200</code
						></pre>
				</div>
			</div>

			<div class="step-card">
				<h3>Push to GitHub</h3>
				<p>Commit your changes and push your code to GitHub:</p>

				<div class="code-block">
					<pre><code
							>git add .
git commit -m "Prepare for Netlify deployment"
git push</code
						></pre>
				</div>
			</div>

			<div class="step-card">
				<h3>Deploy on Netlify</h3>
				<ol>
					<li>
						Go to <a href="https://netlify.com" target="_blank" rel="noopener">Netlify</a> and sign in
						with GitHub
					</li>
					<li>Click "Add new site" → "Import an existing project"</li>
					<li>Connect to GitHub and select your repository</li>
					<li>
						Add these environment variables:
						<div class="env-vars">
							<div class="env-var">
								<span class="env-name">PUBLIC_SUPABASE_URL</span>
								<span class="env-value">https://your-project-id.supabase.co</span>
							</div>
							<div class="env-var">
								<span class="env-name">PUBLIC_SUPABASE_ANON_KEY</span>
								<span class="env-value">your-supabase-anon-key</span>
							</div>
							<div class="env-var">
								<span class="env-name">PUBLIC_FRONTEND_URL</span>
								<span class="env-value">You'll add this after deployment</span>
							</div>
						</div>
					</li>
					<li>Click "Deploy site"</li>
				</ol>
			</div>

			<div class="step-card">
				<h3>Update Environment Variables</h3>
				<p>
					After deployment, update the <code>PUBLIC_FRONTEND_URL</code> environment variable with your
					new Netlify site URL.
				</p>
			</div>
		</div>
	</section>

	<section class="finishing-setup">
		<div class="container">
			<h2>4. Finishing Setup</h2>

			<div class="step-card">
				<h3>Configure Supabase Auth URL</h3>
				<p>
					Now that your frontend is deployed, you need to update your Supabase authentication
					settings:
				</p>
				<ol>
					<li>Go to your Supabase dashboard → Authentication → URL Configuration</li>
					<li>
						Set Site URL to your deployment URL (e.g., <code>https://your-app.vercel.app</code>)
					</li>
					<li>
						Add a redirect URL: <code>https://your-app.vercel.app/auth/callback</code>
					</li>
					<li>Save your changes</li>
				</ol>

				<div class="important-note">
					<h4>Important</h4>
					<p>
						If you later add a custom domain, you'll need to update these URLs in Supabase again.
					</p>
				</div>
			</div>

			<div class="step-card">
				<h3>Create Admin User</h3>
				<ol>
					<li>Visit your deployed application and register a new user</li>
					<li>Go to Supabase → SQL Editor</li>
					<li>
						Run the following SQL to make your user an admin (replace the email with yours):
						<div class="code-block">
							<pre><code
									>UPDATE profiles
SET is_admin = true
WHERE email = 'your-email@example.com';</code
								></pre>
						</div>
					</li>
				</ol>
			</div>

			<div class="step-card">
				<h3>Verify Deployment</h3>
				<p>Test your deployment by:</p>
				<ol>
					<li>Signing in with your admin account</li>
					<li>Creating a test course</li>
					<li>Testing authentication flows (register, login, password reset)</li>
					<li>Verifying that database operations work correctly</li>
				</ol>
			</div>
		</div>
	</section>

	<section class="troubleshooting">
		<div class="container">
			<h2>Common Issues & Solutions</h2>

			<div class="issues-grid">
				<div class="issue-card">
					<h3>Authentication Errors</h3>
					<div class="issue-content">
						<p>
							<strong>Problem:</strong> Users can't log in or receive redirect errors.
						</p>
						<p>
							<strong>Solution:</strong> Check that your Supabase Site URL and redirect URLs match
							your deployment URL exactly. Verify that <code>PUBLIC_FRONTEND_URL</code> is correctly
							set.
						</p>
					</div>
				</div>

				<div class="issue-card">
					<h3>Database Migration Failures</h3>
					<div class="issue-content">
						<p>
							<strong>Problem:</strong> <code>supabase db push</code> command fails with errors.
						</p>
						<p>
							<strong>Solution:</strong> Check your migration files for syntax errors. Verify your Supabase
							CLI is correctly linked to your project. For a fresh start, you can reset your database
							in the Supabase dashboard and try again.
						</p>
					</div>
				</div>

				<div class="issue-card">
					<h3>Missing Environment Variables</h3>
					<div class="issue-content">
						<p>
							<strong>Problem:</strong> Application errors related to undefined variables.
						</p>
						<p>
							<strong>Solution:</strong> Double-check all environment variables are set correctly in
							your deployment platform. Remember that local environment variables are not automatically
							transferred to production.
						</p>
					</div>
				</div>

				<div class="issue-card">
					<h3>Build Failures</h3>
					<div class="issue-content">
						<p>
							<strong>Problem:</strong> Deployment fails during the build process.
						</p>
						<p>
							<strong>Solution:</strong> Check build logs for specific errors. Common issues include
							missing dependencies, incorrect adapter configuration, or TypeScript errors.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="next-steps">
		<div class="container">
			<h2>Next Steps</h2>

			<div class="next-content">
				<p>
					Now that your Asakiri instance is deployed, you can start configuring and customizing it:
				</p>

				<div class="next-grid">
					<div class="next-card">
						<h3>Create Courses</h3>
						<p>
							Start building your language learning content by creating courses, units, and lessons.
						</p>
						<Button href="/teacher/courses" variant="secondary" size="small">Go to Courses</Button>
					</div>

					<!-- <div class="next-card">
						<h3>Customize Theme</h3>
						<p>Adjust colors, fonts, and other visual elements to match your brand.</p>
						<Button href="/admin/settings" variant="secondary" size="small">Settings</Button>
					</div>
					 -->
					<div class="next-card">
						<h3>Configure Federation</h3>
						<p>Connect with other Asakiri instances to share courses across platforms.</p>
						<Button href="/admin/federation" variant="secondary" size="small"
							>Federation Settings</Button
						>
					</div>

					<div class="next-card">
						<h3>Invite Teachers</h3>
						<p>Grow your platform by inviting language experts to create content.</p>
						<Button href="/admin/users" variant="secondary" size="small">Manage Users</Button>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="support">
		<div class="container">
			<h2>Need Help?</h2>

			<div class="support-content">
				<p>Having trouble deploying your Asakiri instance? Find help through these resources:</p>

				<div class="support-links">
					<a
						href="https://github.com/Alekoii/asakiri"
						class="support-link"
						target="_blank"
						rel="noopener"
					>
						GitHub Repository
					</a>
					<a
						href="https://discord.gg/6VhDw5RXJ2"
						class="support-link"
						target="_blank"
						rel="noopener"
					>
						Discord Community
					</a>
					<!-- <a href="https://docs.asakiri.org" class="support-link" target="_blank" rel="noopener">
						Documentation
					</a> -->
				</div>
			</div>
		</div>
	</section>
</div>

<Footer />

<style>
	.deployment-guide {
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
		margin-bottom: var(--gap-md);
	}

	h4 {
		font-size: var(--text-lg);
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

	.requirements-box {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
		margin: var(--gap-xl) auto;
		max-width: 600px;
	}

	.requirements-box h3 {
		text-align: center;
		margin-bottom: var(--gap-md);
	}

	.requirements-box ul {
		list-style-type: none;
		padding: 0;
	}

	.requirements-box li {
		margin-bottom: var(--gap-md);
		padding-left: var(--gap-md);
		position: relative;
	}

	.requirements-box li:before {
		content: '•';
		position: absolute;
		left: 0;
		color: var(--color-primary-500);
	}

	.step-card {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
		margin-bottom: var(--gap-lg);
	}

	.step-card ol {
		padding-left: var(--gap-xl);
		margin: var(--gap-md) 0;
	}

	.step-card li {
		margin-bottom: var(--gap-md);
	}

	.hint {
		font-size: var(--text-sm);
		color: var(--color-neutral-600);
		margin-top: var(--gap-xs);
	}

	.code-block {
		background-color: var(--color-neutral-900);
		border-radius: var(--radius-sm);
		padding: var(--padding-md);
		margin: var(--gap-md) 0;
		overflow-x: auto;
	}

	.code-block pre {
		margin: 0;
	}

	.code-block code {
		color: var(--color-neutral-100);
		font-family: monospace;
		font-size: var(--text-sm);
	}

	.info-box {
		background-color: var(--color-primary-50);
		border-left: 3px solid var(--color-primary-400);
		padding: var(--padding-md);
		margin: var(--gap-md) 0;
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	}

	.info-box h4 {
		color: var(--color-primary-700);
		margin-bottom: var(--gap-xs);
	}

	.info-box p {
		margin-bottom: 0;
	}

	.important-note {
		background-color: #fff3cd;
		border-left: 3px solid #ffc107;
		padding: var(--padding-md);
		margin: var(--gap-md) 0;
		border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	}

	.important-note h4 {
		color: #856404;
		margin-bottom: var(--gap-xs);
	}

	.important-note p {
		margin-bottom: 0;
		color: #856404;
	}

	.options-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--gap-xl);
		margin-top: var(--gap-xl);
	}

	@media (max-width: 768px) {
		.options-grid {
			grid-template-columns: 1fr;
		}
	}

	.option-card {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
		text-align: center;
	}

	.option-logo {
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--gap-md);
	}

	.option-logo img {
		max-height: 100%;
		max-width: 200px;
	}

	.benefits-list {
		text-align: left;
		padding-left: var(--gap-lg);
		margin-top: var(--gap-lg);
	}

	.benefits-list li {
		margin-bottom: var(--gap-sm);
	}

	.env-vars {
		background-color: var(--color-neutral-50);
		border-radius: var(--radius-sm);
		padding: var(--padding-md);
		margin: var(--gap-md) 0;
	}

	.env-var {
		display: flex;
		justify-content: space-between;
		padding: var(--padding-xs) 0;
		border-bottom: 1px solid var(--color-neutral-200);
	}

	.env-var:last-child {
		border-bottom: none;
	}

	.env-name {
		font-family: monospace;
		font-weight: var(--font-semibold);
		color: var(--color-primary-600);
	}

	.env-value {
		color: var(--color-neutral-600);
		font-size: var(--text-sm);
	}

	.issues-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--gap-lg);
	}

	.issue-card {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
	}

	.issue-card h3 {
		border-bottom: 1px solid var(--color-neutral-200);
		padding-bottom: var(--gap-xs);
		margin-bottom: var(--gap-md);
	}

	.issue-content p {
		margin-bottom: var(--gap-sm);
	}

	.issue-content p:last-child {
		margin-bottom: 0;
	}

	.next-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: var(--gap-lg);
		margin-top: var(--gap-lg);
	}

	.next-card {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-lg);
		text-align: center;
	}

	.next-card h3 {
		margin-bottom: var(--gap-sm);
		color: var(--color-primary-600);
	}

	.next-card p {
		margin-bottom: var(--gap-lg);
		min-height: 60px;
	}

	.support-content {
		text-align: center;
		max-width: 700px;
		margin: 0 auto;
	}

	.support-links {
		display: flex;
		justify-content: center;
		gap: var(--gap-lg);
		margin-top: var(--gap-lg);
		flex-wrap: wrap;
	}

	.support-link {
		background-color: var(--color-neutral-0);
		border: 1px solid var(--color-neutral-200);
		border-radius: var(--radius-sm);
		padding: var(--padding-md) var(--padding-lg);
		color: var(--color-primary-600);
		font-weight: var(--font-medium);
		text-decoration: none;
	}

	.support-link:hover {
		border-color: var(--color-primary-300);
		background-color: var(--color-primary-50);
	}

	@media (max-width: 768px) {
		.env-var {
			flex-direction: column;
		}

		.env-value {
			margin-top: var(--gap-xs);
			word-break: break-all;
		}

		.support-links {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
