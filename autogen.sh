#!/bin/sh
### autogen.sh - tool to help build chriscummins.cc
#
# Based on the autogen.sh script from GNU Emacs, written by Glenn Morris
# <rgm@gnu.org> and released under the GNU General Public License version 3.
#

## Tools we need:
## Note that we respect the values of AUTOCONF etc, like autoreconf does.
progs="autoconf automake"

## Minimum versions we need:
autoconf_min=$(sed -n 's/^ *AC_PREREQ(\([0-9\.]*\)).*/\1/p' configure.ac)

automake_min=$(sed -n 's/^ *AM_INIT_AUTOMAKE( *\[\? *\([0-9\.]*\).*/\1/p' configure.ac)

test -n "$autoconf_min" || exit 127
test -n "$automake_min" || exit 127


## $1 = program, eg "autoconf".
## Echo the version string, eg "2.59".
## FIXME does not handle things like "1.4a", but AFAIK those are
## all old versions, so it is OK to fail there.
## Also note that we do not handle micro versions.
get_version ()
{
    ## Remove eg "./autogen.sh: line 50: autoconf: command not found".
    $1 --version 2>&1 | sed -e '/not found/d' -n -e '1 s/.* \([1-9][0-9\.]*\).*/\1/p'
}

## $1 = version string, eg "2.59"
## Echo the major version, eg "2".
major_version ()
{
    echo $1 | sed -e 's/\([0-9][0-9]*\)\..*/\1/'
}

## $1 = version string, eg "2.59"
## Echo the minor version, eg "59".
minor_version ()
{
    echo $1 | sed -e 's/[0-9][0-9]*\.\([0-9][0-9]*\).*/\1/'
}

## $1 = program
## $2 = minimum version.
## Return 0 if program is present with version >= minimum version.
## Return 1 if program is missing.
## Return 2 if program is present but too old.
## Return 3 for unexpected error (eg failed to parse version).
check_version ()
{
    ## Respect eg $AUTOMAKE if it is set, like autoreconf does.
    uprog=`echo $1 | sed 'y/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/'`

    eval uprog=\$${uprog}

    [ x"$uprog" = x ] && uprog=$1

    have_version=`get_version $uprog`

    [ x"$have_version" = x ] && return 1

    have_maj=`major_version $have_version`
    need_maj=`major_version $2`

    [ x"$have_maj" != x ] && [ x"$need_maj" != x ] || return 3

    [ $have_maj -gt $need_maj ] && return 0
    [ $have_maj -lt $need_maj ] && return 2

    have_min=`minor_version $have_version`
    need_min=`minor_version $2`

    [ x"$have_min" != x ] && [ x"$need_min" != x ] || return 3

    [ $have_min -ge $need_min ] && return 0
    return 2
}

echo "Checking whether you have the necessary tools..."

missing=

for prog in $progs; do

    eval min=\$${prog}_min

    echo -n "Checking for $prog (need at least version $min)... "

    check_version $prog $min

    retval=$?

    case $retval in
        0) stat="ok" ;;
        1) stat="missing" ;;
        2) stat="too old" ;;
        *) stat="unable to check" ;;
    esac

    echo $stat

    if [ $retval -ne 0 ]; then
        missing="$missing $prog"
        eval ${prog}_why=\""$stat"\"
    fi

done

if [ x"$missing" != x ]; then

	cat <<EOF

Building pip-db requires the following specialised programs:
EOF

	for prog in $progs; do
		eval min=\$${prog}_min

		echo "$prog (minimum version $min)"
	done


	cat <<EOF

Your system seems to be missing the following tool(s):
EOF

	for prog in $missing; do
		eval why=\$${prog}_why

		echo "$prog ($why)"
	done

	cat <<EOF

If you think you have the required tools, please add them to your PATH
and re-run this script.

Otherwise, please try installing them.
On systems using rpm and yum, try: "yum install PACKAGE"
On systems using dpkg and apt, try: "apt-get install PACKAGE"
Then re-run this script.

If you do not have permission to do this, or if the version provided
by your system is too old, it is normally straightforward to build
these packages from source.  You can find the sources at:

ftp://ftp.gnu.org/gnu/PACKAGE/

Download the package (make sure you get at least the minimum version
listed above), extract it using tar, then run configure, make,
make install.  Add the installation directory to your PATH and re-run
this script.
EOF

	exit 1
fi

echo "Your system has the required tools, running autoreconf..."


## Let autoreconf figure out what, if anything, needs doing.
autoreconf --install || exit $?

echo
echo "You can now run \`./configure'."

exit 0

### autogen.sh ends here
