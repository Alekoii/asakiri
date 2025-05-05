export async function fetchFederatedCourses(instances) {
    const federatedCourses = [];

    for (const instance of instances) {
        if (!instance.is_active) continue;

        try {
            const response = await fetch(
                `${instance.url}/api/federation/courses`,
                {
                    headers: {
                        "Accept": "application/json",
                    },
                    timeout: 5000, // 5-second timeout
                },
            );

            if (response.ok) {
                const data = await response.json();

                // Add instance information to each course
                const instanceCourses = (data.courses || []).map((course) => ({
                    ...course,
                    instanceId: instance.id,
                    instanceName: instance.name,
                    instanceUrl: instance.url,
                    isFederated: true,
                    // Add source URL for the course
                    courseUrl: `${instance.url}/course/${course.id}`,
                }));

                federatedCourses.push(...instanceCourses);
            }
        } catch (err) {
            console.error(
                `Failed to fetch courses from ${instance.name}:`,
                err,
            );
            // Continue with other instances even if one fails
        }
    }

    return federatedCourses;
}
