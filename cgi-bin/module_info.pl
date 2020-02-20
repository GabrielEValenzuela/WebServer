#!/usr/bin/perl
use strict;
use warnings FATAL => 'all';
use JSON;
use CGI qw(:standard);

my $out = qx( lsmod 2>&1 );
my @lines = split("\n",$out);
my @result = ();
my $index = 0;

foreach $_ (@lines){
    my @entry = split('\s+',$_,3);
    $result[$index] = \@entry;
    $index++;
}

my $json_result = encode_json \@result;
print header('application/json');
print $json_result;