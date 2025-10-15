#!/bin/sh -l

# The 'check-consistency' and '--input' arguments are passed from the action.yml file.
# The --porcelain flag ensures the output is a markdown table.
# This script executes the command and appends its output to the summary file.
/jabref/jabkit/bin/jabkit "$@" >> $GITHUB_STEP_SUMMARY