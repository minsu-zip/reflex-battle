import { COLORS } from '@/constants/colors'
import React from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import {
  NativeAdView as GADNativeAdView,
  NativeAd,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads'

interface NativeAdViewProps {
  preloadedAd?: NativeAd | null
  isLoading?: boolean
}

export default function NativeAdViewComponent({ preloadedAd, isLoading }: NativeAdViewProps) {
  const nativeAd = preloadedAd ?? null
  const loading = isLoading ?? false

  if (!loading && !nativeAd) {
    return null
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <GADNativeAdView nativeAd={nativeAd!} style={styles.adContainer}>
      <View style={styles.adContent}>
        {/* 광고 아이콘 */}
        <NativeAsset assetType={NativeAssetType.ICON}>
          {nativeAd?.icon ? (
            <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </NativeAsset>

        <View style={styles.textContainer}>
          {/* 광고 제목 */}
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text style={styles.headline} numberOfLines={1}>
              {nativeAd?.headline}
            </Text>
          </NativeAsset>

          {/* 광고 설명 */}
          <NativeAsset assetType={NativeAssetType.BODY}>
            <Text style={styles.body} numberOfLines={2}>
              {nativeAd?.body}
            </Text>
          </NativeAsset>

          {/* 광고주 */}
          {nativeAd?.advertiser && (
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <Text style={styles.advertiser} numberOfLines={1}>
                {nativeAd.advertiser}
              </Text>
            </NativeAsset>
          )}
        </View>
      </View>

      {/* 미디어 뷰 (이미지/비디오) */}
      {nativeAd?.mediaContent && <NativeMediaView style={styles.mediaView} resizeMode="cover" />}

      {/* CTA 버튼 */}
      <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
        <View style={styles.ctaButton}>
          <Text style={styles.ctaText}>{nativeAd?.callToAction}</Text>
        </View>
      </NativeAsset>

      {/* 광고 표시 라벨 */}
      <View style={styles.adBadge}>
        <Text style={styles.adBadgeText}>AD</Text>
      </View>
    </GADNativeAdView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  adContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
  },
  adContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headline: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  advertiser: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  mediaView: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    marginBottom: 12,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  adBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.background,
  },
})
