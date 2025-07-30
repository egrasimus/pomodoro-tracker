export function formatSoundCloudTitle(url: string): string {
	const last = url.split("/").filter(Boolean).pop() || ""
	const formatted = last.replace(/-/g, " ")
	return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
