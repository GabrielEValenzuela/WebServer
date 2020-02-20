#!/usr/bin/perl
use warnings;
use strict;
use CGI qw(:standard);
use CGI::Carp qw(fatalsToBrowser);
use JSON;

my $query = new CGI;
my $year = $query->param("year");
my $day = sprintf '%03s', $query->param("daynumber");
my $hour = sprintf '%02s', $query->param("hour");
my @result;
my $index = 0;

my  $raw_out = qx(aws s3 ls noaa-goes16/ABI-L2-CMIPF/$year/$day/$hour/ --no-sign-request | grep C13);

my @tmp = split("\n",$raw_out);

foreach $_ (@tmp){
    my @entry_data = split('\s+',$_,4);
    $result[$index] = \@entry_data;
    $index++;
}

my $json_result = encode_json \@result;
print header('application/json');
print $json_result;