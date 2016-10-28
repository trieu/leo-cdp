package com.yqritc.scalablevideoview;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;

/**
 * Created by anhvt on 26/10/2016.
 */

public class HolderVideo extends RelativeLayout {

    private ScalableVideoView holder;
    private Button btnClose;
    private TextView txttitle, txtdescription;

    public HolderVideo(Context context) {
        super(context);
        init();
    }



    public HolderVideo(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public HolderVideo(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init();
    }

    public ScalableVideoView getHolder() {
        return this.holder;
    }
    private void init() {
        inflate(getContext(), R.layout.holdervideo, this);

        this.holder = (ScalableVideoView) findViewById(R.id.holder);
        this.btnClose = (Button) findViewById(R.id.btnClose);
        this.txttitle = (TextView) findViewById(R.id.txttitle);
        this.txtdescription = (TextView) findViewById(R.id.txtdescription);

        this.btnClose.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                holder.mMediaPlayer.stop();
                holder.mMediaPlayer.release();
                HolderVideo.this.setVisibility(view.GONE);
            }
        });
        
    }
}
