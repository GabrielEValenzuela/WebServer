#!/usr/bin/perl
use strict;
use warnings FATAL => 'all';
use JSON;
use CGI qw(:standard);


my $cpuStat = `mpstat  -u -P ALL 1 1| tail -n5 | awk '{print 100-\$12}'`;
my @arrayStat = split "\n", $cpuStat;

my $jsonResponse = encode_json \@arrayStat;
print header('application/json');
print $jsonResponse;