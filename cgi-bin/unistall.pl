#!/usr/bin/perl
use strict;
use warnings FATAL => 'all';
use JSON;
use CGI qw(:standard);

my %output = (
    error => "",
    stdout => "",
    file_name => "",
);

my $upload_directory = "/home/www-data/www.os2.unc/data";
my $query = new CGI;
my $file_name = $query->param("filename");

if(index($file_name,'.ko')==-1){
    $file_name = $file_name . '.ko';
}

$output{stdout} = qx (modinfo $upload_directory/$file_name 2>1);
$output{error}  = $? >> 8;
$output{stdout} =~ s/\n/<br>/g;
$output{file_name} = $file_name;

print header('application/json');
my $json_response = encode_json \%output;
print $json_response;