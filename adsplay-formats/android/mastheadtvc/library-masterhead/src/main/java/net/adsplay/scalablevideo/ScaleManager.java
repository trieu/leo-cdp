package net.adsplay.scalablevideo;

import android.graphics.Matrix;


public class ScaleManager {

    private Size mViewSize;
    private Size mVideoSize;

    public ScaleManager(Size viewSize, Size videoSize) {
        mViewSize = viewSize;
        mVideoSize = videoSize;
    }

    public Matrix getScaleMatrix(ScalableType scalableType) {
        switch (scalableType) {
            case NONE:
                return getNoScale(PivotPoint.CENTER);

            default:
                return null;
        }
    }

    private Matrix getMatrix(float sx, float sy, float px, float py) {
        Matrix matrix = new Matrix();
        matrix.setScale(sx, sy, px, py);
        return matrix;
    }

    private Matrix getMatrix(float sx, float sy, PivotPoint pivotPoint) {
        switch (pivotPoint) {

            case CENTER:
                return getMatrix(sx, sy, mViewSize.getWidth() / 2f, mViewSize.getHeight() / 2f);

            default:
                throw new IllegalArgumentException("Illegal PivotPoint");
        }
    }

    private Matrix getNoScale(PivotPoint pivotPoint) {

        return getMatrix(1, 1 , pivotPoint);
    }



}

