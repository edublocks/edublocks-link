export default `
import time

old_print = print

# Overwrite print so that we can't hammer the standard output.
# Print is limited to 1 line every 1/10 seconds.
def print(*args):
    old_print(*args)
    time.sleep(0.10)

print()
print("[Starting]")
print()`;