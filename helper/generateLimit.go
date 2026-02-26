package helper

func GenerateLimits(max int) []int {
	steps := []int{1000, 100, 10, 1}
	var limits []int
	seen := make(map[int]bool)

	for _, step := range steps {
		for v := max; v > 0; v -= step {
			if !seen[v] {
				limits = append(limits, v)
				seen[v] = true
			}
		}
	}

	return limits
}
