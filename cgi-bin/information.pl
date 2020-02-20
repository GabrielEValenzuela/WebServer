#!/usr/bin/perl
use strict;
use warnings FATAL => 'all';
use JSON;
use CGI qw(:standard);

# ==============================
# CPU INFO
# ==============================
my @cpuInfo = ();
# Obtenemos la info del /proc/cpuinfo
my $cpuFileInfo = '/proc/cpuinfo';
if (open(my $fh, '<:encoding(UTF-8)', $cpuFileInfo)) {
    # Para control, si hay nas informacion ademas de la de los cores
    my $ncpu = 0;
    while (my $row = <$fh>) {
        # Eliminamos fin de linea para parsear por expresion regular
        chomp $row;
        if (length($row) != 0){
            my ($info, $data) = split('\s+:\s+',$row);
            my @tmp = ($ncpu, $info, $data);
            push (@cpuInfo, \@tmp);
        }else{
            $ncpu++;
        }
    }
}

# ==============================
#   INFORMACION DE LA MEMORIA
# ==============================
my @memInfo = ();
my $memFileInfo = '/proc/meminfo';
if (open(my $fh, '<:encoding(UTF-8)', $memFileInfo)) {
    while (my $row = <$fh>) {
        chomp $row;
        if (length($row) != 0){
            #my ($info, $data, $unit) = split(':*\s+',$row);
            my @tmp = split(':*\s+',$row);
            push (@memInfo, \@tmp);
        }
    }
}

# ==============================
#   INFORMACION DE UPTIME
# ==============================
my @upInfo = ();
my $uptimeFileInfo = '/proc/uptime';
if (open(my $fh, '<:encoding(UTF-8)', $uptimeFileInfo)) {
    while (my $row = <$fh>) {
        chomp $row;
        if (length($row) != 0){
            my @tmp = split('\s+',$row);
            push (@upInfo, \@tmp);
        }
    }
}

# ==============================
#            DATE
# ==============================

my @months = qw(January February March April May June July August September October November December);
my @days = qw(Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday);
my ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime();
$year += 1900;
my $currentDate = "$days[$wday] $mday $months[$mon] of $year";
my $currentTime = "$hour:$min:$sec";
my @dateSring = ($currentTime,$currentDate);


# ==============================
#            JSON RESPONSE
# ==============================

my %allInfo = (
    'cpuInfo' => \@cpuInfo,
    'memInfo' => \@memInfo,
    'uptimeInfo' => \@upInfo,
    'dateInfo' => \@dateSring,
);
my $jsonResponse = encode_json \%allInfo;
print header('application/json');
print $jsonResponse;